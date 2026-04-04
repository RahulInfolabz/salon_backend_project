const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateSubCategory(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { id, category_id, subcategory_name, subcategory_description, status } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid subcategory ID is required",
      });
    }

    const db = await connectDB();
    const updateFields = { updated_at: new Date() };

    if (category_id && ObjectId.isValid(category_id))
      updateFields.category_id = new ObjectId(category_id);
    if (subcategory_name) updateFields.subcategory_name = subcategory_name;
    if (subcategory_description) updateFields.subcategory_description = subcategory_description;
    if (status) updateFields.status = status;
    if (req.file) updateFields.subcategory_image = `/uploads/subcategories/${req.file.filename}`;

    const result = await db
      .collection("service_subcategories")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

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
