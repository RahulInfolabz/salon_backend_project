const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetSubCategories(req, res) {
  try {
    const { category_id } = req.query;

    const db = await connectDB();
    const collection = db.collection("service_subcategories");

    const matchStage = { status: "Active" };
    if (category_id && ObjectId.isValid(category_id)) {
      matchStage.category_id = new ObjectId(category_id);
    }

    const subcategories = await collection
      .aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: "service_categories",
            localField: "category_id",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        { $sort: { subcategory_name: 1 } },
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Subcategories fetched successfully",
      data: subcategories,
    });
  } catch (error) {
    console.error("GetSubCategories.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { GetSubCategories };
