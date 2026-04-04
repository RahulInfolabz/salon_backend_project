const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddSubCategory(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { category_id, subcategory_name, subcategory_description } = req.body;

    if (!category_id || !subcategory_name || !subcategory_description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!ObjectId.isValid(category_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const db = await connectDB();

    const categoryExists = await db
      .collection("service_categories")
      .findOne({ _id: new ObjectId(category_id) });

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const subcategoryImage = req.file
      ? `/uploads/subcategories/${req.file.filename}`
      : "";

    await db.collection("service_subcategories").insertOne({
      category_id: new ObjectId(category_id),
      subcategory_name,
      subcategory_description,
      subcategory_image: subcategoryImage,
      status: "Active",
      created_at: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Subcategory added successfully",
    });
  } catch (error) {
    console.error("AddSubCategory.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { AddSubCategory };
