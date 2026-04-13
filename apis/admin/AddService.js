const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddService(req, res) {
  try {
    const {
      role,
      category_id,
      subcategory_id,
      service_name,
      service_description,
      price,
      duration_mins,
    } = req.body;

    // ✅ Authorization (role from frontend)
    

    // ✅ Required validation
    if (
      !category_id ||
      !subcategory_id ||
      !service_name ||
      !service_description ||
      !price ||
      !duration_mins
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ ObjectId validation
    if (!ObjectId.isValid(category_id) || !ObjectId.isValid(subcategory_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category or subcategory ID",
      });
    }

    const db = await connectDB();
    const collection = db.collection("services");

    // ✅ Handle image
    const serviceImage = req.file
      ? `/uploads/services/${req.file.filename}`
      : "";

    // ✅ Insert service
    await collection.insertOne({
      category_id: new ObjectId(category_id),
      subcategory_id: new ObjectId(subcategory_id),
      service_name,
      service_description,
      price: parseFloat(price),
      duration_mins: parseInt(duration_mins),
      service_image: serviceImage,
      status: "Active",
      created_at: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Service added successfully",
    });

  } catch (error) {
    console.error("AddService.js: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { AddService };