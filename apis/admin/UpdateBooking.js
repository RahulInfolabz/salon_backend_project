const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateBooking(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { id, booking_status, time_slot } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid booking ID is required",
      });
    }

    const validStatuses = ["Pending", "Approved", "Cancelled", "Completed"];
    if (booking_status && !validStatuses.includes(booking_status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const db = await connectDB();
    const updateFields = { updated_at: new Date() };

    if (booking_status) updateFields.booking_status = booking_status;
    if (time_slot) updateFields.time_slot = time_slot;

    const result = await db
      .collection("bookings")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

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
