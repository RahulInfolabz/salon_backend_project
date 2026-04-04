const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function BookService(req, res) {
  try {
    const { user_id, service_id, booking_date, notes } = req.body;

    // ✅ Required fields validation
    if (!user_id || !service_id || !booking_date) {
      return res.status(400).json({
        success: false,
        message: "User ID, service ID and booking date are required",
      });
    }

    // ✅ ObjectId validation
    if (!ObjectId.isValid(user_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!ObjectId.isValid(service_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const db = await connectDB();
    const serviceCollection = db.collection("services");
    const bookingCollection = db.collection("bookings");

    // ✅ Check service exists
    const service = await serviceCollection.findOne({
      _id: new ObjectId(service_id),
      status: "Active",
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // ✅ Insert booking
    let booking = await bookingCollection.insertOne({
      user_id: new ObjectId(user_id),
      service_id: new ObjectId(service_id),
      booking_date: new Date(booking_date),
      time_slot: "", // Admin will assign
      booking_status: "Pending",
      payment_status: "Pending",
      total_amount: service.price,
      notes: notes || "",
      created_at: new Date(),
      updated_at: new Date(),
    });

    // ✅ Success response
    return res.status(201).json({
      success: true,
      message: "Service booked successfully. Time slot will be assigned by admin.",
      booking: booking.insertedId
    });

  } catch (error) {
    console.error("BookService.js: ", error);

    // ❌ Error response
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { BookService };