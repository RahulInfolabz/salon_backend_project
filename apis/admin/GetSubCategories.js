const connectDB = require("../../db/dbConnect");

async function GetAdminSubCategories(req, res) {
  try {
    const { role } = req.query;

    // ✅ Authorization (role from frontend)
    

    const db = await connectDB();
    const collection = db.collection("service_subcategories");

    // ✅ Aggregation
    const subcategories = await collection
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