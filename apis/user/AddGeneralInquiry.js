const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddGeneralInquiry(req, res) {
  try {
    const { user_id, inquiry_subject, inquiry_message } = req.body;

    // ✅ Required fields validation
    if (!user_id || !inquiry_subject || !inquiry_message) {
      return res.status(400).json({
        success: false,
        message: "User ID, inquiry subject and message are required",
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

    // ✅ Insert data
    await collection.insertOne({
      user_id: new ObjectId(user_id),
      inquiry_subject,
      inquiry_message,
      inquiry_date: new Date(),
      status: "Pending",
    });

    // ✅ Success response
    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
    });

  } catch (error) {
    console.error("AddGeneralInquiry.js: ", error);

    // ❌ Error response
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { AddGeneralInquiry };