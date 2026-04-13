const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateService(req, res) {
  try {
    const {
      role,
      id,
      category_id,
      subcategory_id,
      service_name,
      service_description,
      price,
      duration_mins,
      status,
    } = req.body;

    // ✅ Authorization (role from frontend)
    

    // ✅ ID validation
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid service ID is required",
      });
    }

    // ✅ At least one field check
    if (
      !category_id &&
      !subcategory_id &&
      !service_name &&
      !service_description &&
      !price &&
      !duration_mins &&
      !status &&
      !req.file
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update",
      });
    }

    const db = await connectDB();
    const collection = db.collection("services");

    // ✅ Prepare update fields
    const updateFields = { updated_at: new Date() };

    if (category_id && ObjectId.isValid(category_id)) {
      updateFields.category_id = new ObjectId(category_id);
    }

    if (subcategory_id && ObjectId.isValid(subcategory_id)) {
      updateFields.subcategory_id = new ObjectId(subcategory_id);
    }

    if (service_name) updateFields.service_name = service_name;
    if (service_description) updateFields.service_description = service_description;
    if (price) updateFields.price = parseFloat(price);
    if (duration_mins) updateFields.duration_mins = parseInt(duration_mins);
    if (status) updateFields.status = status;

    if (req.file) {
      updateFields.service_image = `/uploads/services/${req.file.filename}`;
    }

    // ✅ Update service
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
    });

  } catch (error) {
    console.error("UpdateService.js: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { UpdateService };