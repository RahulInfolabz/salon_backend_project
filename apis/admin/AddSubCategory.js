const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddSubCategory(req, res) {
  try {
    const { role, category_id, subcategory_name, subcategory_description } = req.body;

    // ✅ Authorization (role from frontend)
    if (role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // ✅ Required validation
    if (!category_id || !subcategory_name || !subcategory_description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ ObjectId validation
    if (!ObjectId.isValid(category_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const db = await connectDB();

    // ✅ Check category exists
    const categoryExists = await db
      .collection("service_categories")
      .findOne({ _id: new ObjectId(category_id) });

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const collection = db.collection("service_subcategories");

    // ✅ Handle image
    const subcategoryImage = req.file
      ? `/uploads/subcategories/${req.file.filename}`
      : "";

    // ✅ Insert subcategory
    await collection.insertOne({
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