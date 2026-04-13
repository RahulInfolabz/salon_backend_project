const connectDB = require("../../db/dbConnect");

async function GetPayments(req, res) {
  try {
    const { role } = req.query;

    // ✅ Authorization (role from frontend)
    if (role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const db = await connectDB();
    const collection = db.collection("payments");

    // ✅ Aggregation
    const payments = await collection
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "bookings",
            localField: "booking_id",
            foreignField: "_id",
            as: "booking",
          },
        },
        { $unwind: { path: "$booking", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "services",
            localField: "booking.service_id",
            foreignField: "_id",
            as: "service",
          },
        },
        { $unwind: { path: "$service", preserveNullAndEmptyArrays: true } },

        // ✅ Remove sensitive data
        { $project: { "user.password": 0 } },

        { $sort: { payment_date: -1 } },
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Payments fetched successfully",
      data: payments,
    });

  } catch (error) {
    console.error("GetPayments.js: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { GetPayments };