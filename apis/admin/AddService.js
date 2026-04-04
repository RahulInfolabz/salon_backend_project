const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddService(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const {
      category_id,
      subcategory_id,
      service_name,
      service_description,
      price,
      duration_mins,
    } = req.body;

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

    if (!ObjectId.isValid(category_id) || !ObjectId.isValid(subcategory_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category or subcategory ID",
      });
    }

    const db = await connectDB();
    const serviceImage = req.file
      ? `/uploads/services/${req.file.filename}`
      : "";

    await db.collection("services").insertOne({
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
