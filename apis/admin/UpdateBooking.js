const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateBooking(req, res) {
  try {
    const { role, id, booking_status, time_slot } = req.body;

    // ✅ Authorization (role from frontend)
    if (role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // ✅ ID validation
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid booking ID is required",
      });
    }

    // ✅ Status validation
    const validStatuses = ["Pending", "Approved", "Cancelled", "Completed"];
    if (booking_status && !validStatuses.includes(booking_status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // ✅ At least one field check
    if (!booking_status && !time_slot) {
      return res.status(400).json({
        success: false,
        message: "At least one field (status or time slot) is required",
      });
    }

    const db = await connectDB();
    const collection = db.collection("bookings");

    // ✅ Prepare update
    const updateFields = { updated_at: new Date() };

    if (booking_status) updateFields.booking_status = booking_status;
    if (time_slot) updateFields.time_slot = time_slot;

    // ✅ Update booking
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
    });

  } catch (error) {
    console.error("UpdateBooking.js: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { UpdateBooking };