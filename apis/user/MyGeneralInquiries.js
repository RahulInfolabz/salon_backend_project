const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function MyGeneralInquiries(req, res) {
  try {
    const { user_id } = req.query;

    // ✅ Required validation
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // ✅ ObjectId validation
    if (!ObjectId.isValid(user_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const db = await connectDB();
    const collection = db.collection("general_inquiries");

    // ✅ Fetch inquiries
    const inquiries = await collection
      .find({ user_id: new ObjectId(user_id) })
      .sort({ inquiry_date: -1 })
      .toArray();

    // ✅ Success response
    return res.status(200).json({
      success: true,
      message: "Inquiries fetched successfully",
      data: inquiries,
    });

  } catch (error) {
    console.error("MyGeneralInquiries.js: ", error);

    // ❌ Error response
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { MyGeneralInquiries };