const connectDB = require("../../db/dbConnect");

async function GetInquiries(req, res) {
  try {
    const { role } = req.query;

    // ✅ Authorization (role from frontend)
    

    const db = await connectDB();
    const collection = db.collection("general_inquiries");

    // ✅ Aggregation
    const inquiries = await collection
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

        // ✅ Remove sensitive data
        { $project: { "user.password": 0 } },

        { $sort: { inquiry_date: -1 } },
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Inquiries fetched successfully",
      data: inquiries,
    });

  } catch (error) {
    console.error("GetInquiries.js: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { GetInquiries };