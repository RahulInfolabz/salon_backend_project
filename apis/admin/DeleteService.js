const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function DeleteService(req, res) {
  try {
    const { role } = req.body;
    const { id } = req.params;

    // ✅ Authorization (role from frontend)
    if (role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // ✅ ObjectId validation
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const db = await connectDB();
    const collection = db.collection("services");

    // ✅ Delete service
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });

  } catch (error) {
    console.error("DeleteService.js: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { DeleteService };