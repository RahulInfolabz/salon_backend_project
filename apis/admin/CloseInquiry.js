const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function CloseInquiry(req, res) {
  try {
    const admin = req.session.user;
    if (!admin || admin.session.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inquiry ID",
      });
    }

    const db = await connectDB();
    const result = await db
      .collection("general_inquiries")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "Closed", updated_at: new Date() } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inquiry closed successfully",
    });
  } catch (error) {
    console.error("CloseInquiry.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { CloseInquiry };
