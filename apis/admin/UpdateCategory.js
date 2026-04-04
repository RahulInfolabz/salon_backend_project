const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateCategory(req, res) {
  try {
    const { role, id, category_name, category_description, status } = req.body;

    // ✅ Authorization (role from frontend)
    if (role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // ✅ ID validation
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid category ID is required",
      });
    }

    // ✅ At least one field check
    if (!category_name && !category_description && !status && !req.file) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    const db = await connectDB();
    const collection = db.collection("service_categories");

    // ✅ Prepare update fields
    const updateFields = { updated_at: new Date() };

    if (category_name) updateFields.category_name = category_name;
    if (category_description) updateFields.category_description = category_description;
    if (status) updateFields.status = status;

    if (req.file) {
      updateFields.category_image = `/uploads/categories/${req.file.filename}`;
    }

    // ✅ Update category
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
    });

  } catch (error) {
    console.error("UpdateCategory.js: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { UpdateCategory };