const connectDB = require("../../db/dbConnect");

async function GetInquiries(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const db = await connectDB();
    const inquiries = await db
      .collection("general_inquiries")
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
