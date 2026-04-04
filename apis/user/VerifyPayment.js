const { ObjectId } = require("mongodb");
const crypto = require("crypto");
const connectDB = require("../../db/dbConnect");

async function VerifyPayment(req, res) {
  try {
    const user = req.session.user;
    if (!user || !user.isAuth || user.session.role !== "User") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const {
      booking_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !booking_id ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "All payment fields are required",
      });
    }

    // Verify Razorpay signature
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

    // Fetch booking to get amount
    const booking = await bookingCollection.findOne({
      _id: new ObjectId(booking_id),
      user_id: new ObjectId(user.session._id),
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Save payment record
    await paymentCollection.insertOne({
      user_id: new ObjectId(user.session._id),
      booking_id: new ObjectId(booking_id),
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: booking.total_amount,
      payment_status: "Paid",
      payment_date: new Date(),
    });

    // Update booking payment status
    await bookingCollection.updateOne(
      { _id: new ObjectId(booking_id) },
      {
        $set: {
          payment_status: "Paid",
          updated_at: new Date(),
        },
      }
    );

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
