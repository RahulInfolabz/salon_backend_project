const { ObjectId } = require("mongodb");
const Razorpay = require("razorpay");
const connectDB = require("../../db/dbConnect");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function GenOrderId(req, res) {
  try {
    const { user_id, booking_id } = req.body;

    // ✅ Required validation
    if (!user_id || !booking_id) {
      return res.status(400).json({
        success: false,
        message: "User ID and booking ID are required",
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

    const db = await connectDB();
    const bookingCollection = db.collection("bookings");

    // ✅ Check booking exists for user
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

    // ✅ Check payment already done
    if (booking.payment_status === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed for this booking",
      });
    }

    // ✅ Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(booking.total_amount * 100), // paise
      currency: "INR",
      receipt: `receipt_${booking_id}`,
    });

    // ✅ Success response
    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        booking_id: booking_id,
      },
    });

  } catch (error) {
    console.error("GenOrderId.js: ", error);

    // ❌ Error response
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { GenOrderId };