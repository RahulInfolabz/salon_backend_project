const { ObjectId } = require("mongodb");
const crypto = require("crypto");
const connectDB = require("../../db/dbConnect");

async function VerifyPayment(req, res) {
  try {
    const {
      user_id,
      booking_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // ✅ Required validation
    if (
      !user_id ||
      !booking_id ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "All payment fields including user ID are required",
      });
    }

    // ✅ ObjectId validation
    if (!ObjectId.isValid(user_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!ObjectId.isValid(booking_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    // ✅ Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Payment verification failed.",
      });
    }

    const db = await connectDB();
    const bookingCollection = db.collection("bookings");
    const paymentCollection = db.collection("payments");

    // ✅ Fetch booking
    const booking = await bookingCollection.findOne({
      _id: new ObjectId(booking_id),
      user_id: new ObjectId(user_id),
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ✅ Prevent duplicate payment
    if (booking.payment_status === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already verified",
      });
    }

    // ✅ Save payment
    await paymentCollection.insertOne({
      user_id: new ObjectId(user_id),
      booking_id: new ObjectId(booking_id),
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: booking.total_amount,
      payment_status: "Paid",
      payment_date: new Date(),
    });

    // ✅ Update booking
    await bookingCollection.updateOne(
      { _id: new ObjectId(booking_id) },
      {
        $set: {
          payment_status: "Paid",
          updated_at: new Date(),
        },
      }
    );

    // ✅ Success response
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (error) {
    console.error("VerifyPayment.js: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { VerifyPayment };