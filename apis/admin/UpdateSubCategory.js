const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateSubCategory(req, res) {
  try {
    const {
      role,
      id,
      category_id,
      subcategory_name,
      subcategory_description,
      status,
    } = req.body;

    // ✅ Authorization (role from frontend)
    

    // ✅ ID validation
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid subcategory ID is required",
      });
    }

    // ✅ At least one field check
    if (
      !category_id &&
      !subcategory_name &&
      !subcategory_description &&
      !status &&
      !req.file
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    const db = await connectDB();
    const collection = db.collection("service_subcategories");

    // ✅ Prepare update fields
    const updateFields = { updated_at: new Date() };

    if (category_id && ObjectId.isValid(category_id)) {
      updateFields.category_id = new ObjectId(category_id);
    }

    if (subcategory_name) updateFields.subcategory_name = subcategory_name;
    if (subcategory_description)
      updateFields.subcategory_description = subcategory_description;
    if (status) updateFields.status = status;

    if (req.file) {
      updateFields.subcategory_image = `/uploads/subcategories/${req.file.filename}`;
    }

    // ✅ Update subcategory
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
    });

  } catch (error) {
    console.error("UpdateSubCategory.js: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { UpdateSubCategory };