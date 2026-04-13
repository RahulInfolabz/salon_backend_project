const connectDB = require("../../db/dbConnect");

async function GetAdminFeedbacks(req, res) {
  try {
    const { role } = req.query;

    // ✅ Authorization (role from frontend)
    

    const db = await connectDB();
    const collection = db.collection("feedbacks");

    // ✅ Aggregation
    const feedbacks = await collection
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
            from: "services",
            localField: "service_id",
            foreignField: "_id",
            as: "service",
          },
        },
        { $unwind: { path: "$service", preserveNullAndEmptyArrays: true } },

        // ✅ Remove sensitive data
        { $project: { "user.password": 0 } },

        { $sort: { feedback_date: -1 } },
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Feedbacks fetched successfully",
      data: feedbacks,
    });

  } catch (error) {
    console.error("admin/GetFeedbacks.js: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { GetAdminFeedbacks };