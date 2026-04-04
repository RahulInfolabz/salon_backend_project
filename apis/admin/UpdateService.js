const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateService(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const {
      id,
      category_id,
      subcategory_id,
      service_name,
      service_description,
      price,
      duration_mins,
      status,
    } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid service ID is required",
      });
    }

    const db = await connectDB();
    const updateFields = { updated_at: new Date() };

    if (category_id && ObjectId.isValid(category_id))
      updateFields.category_id = new ObjectId(category_id);
    if (subcategory_id && ObjectId.isValid(subcategory_id))
      updateFields.subcategory_id = new ObjectId(subcategory_id);
    if (service_name) updateFields.service_name = service_name;
    if (service_description) updateFields.service_description = service_description;
    if (price) updateFields.price = parseFloat(price);
    if (duration_mins) updateFields.duration_mins = parseInt(duration_mins);
    if (status) updateFields.status = status;
    if (req.file) updateFields.service_image = `/uploads/services/${req.file.filename}`;

    const result = await db
      .collection("services")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

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
