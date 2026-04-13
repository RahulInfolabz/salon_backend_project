const connectDB = require("../../db/dbConnect");

async function AddCategory(req, res) {
  try {
    const { role, category_name, category_description } = req.body;

    // ✅ Authorization (role check from frontend)
    if (role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // ✅ Required validation
    if (!category_name || !category_description) {
      return res.status(400).json({
        success: false,
        message: "Category name and description are required",
      });
    }

    const db = await connectDB();
    const collection = db.collection("service_categories");

    // ✅ Handle image
    const categoryImage = req.file
      ? `/uploads/categories/${req.file.filename}`
      : "";

    // ✅ Insert category
    await collection.insertOne({
      category_name,
      category_description,
      category_image: categoryImage,
      status: "Active",
      created_at: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Category added successfully",
    });

  } catch (error) {
    console.error("AddCategory.js: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { AddCategory };