const connectDB = require("../../db/dbConnect");

async function GetAdminSubCategories(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const db = await connectDB();
    const subcategories = await db
      .collection("service_subcategories")
      .aggregate([
        {
          $lookup: {
            from: "service_categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        { $sort: { created_at: -1 } },
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Subcategories fetched successfully",
      data: subcategories,
    });
  } catch (error) {
    console.error("admin/GetSubCategories.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { GetAdminSubCategories };
