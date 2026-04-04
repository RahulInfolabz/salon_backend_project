const connectDB = require("../../db/dbConnect");

async function AddCategory(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { category_name, category_description } = req.body;

    if (!category_name || !category_description) {
      return res.status(400).json({
        success: false,
        message: "Category name and description are required",
      });
    }

    const db = await connectDB();
    const collection = db.collection("service_categories");

    const categoryImage = req.file
      ? `/uploads/categories/${req.file.filename}`
      : "";

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
