const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function DeleteSubCategory(req, res) {
  try {
    const { role } = req.body;
    const { id } = req.params;

    // ✅ Authorization (role from frontend)
    

    // ✅ ObjectId validation
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory ID",
      });
    }

    const db = await connectDB();
    const collection = db.collection("service_subcategories");

    // ✅ Delete subcategory
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully",
    });

  } catch (error) {
    console.error("DeleteSubCategory.js: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { DeleteSubCategory };