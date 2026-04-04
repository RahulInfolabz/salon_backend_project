const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function AddGeneralInquiry(req, res) {
  try {
    const user = req.session.user;
    if (!user || !user.isAuth || user.session.role !== "User") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { inquiry_subject, inquiry_message } = req.body;

    if (!inquiry_subject || !inquiry_message) {
      return res.status(400).json({
        success: false,
        message: "Inquiry subject and message are required",
      });
    }

    const db = await connectDB();
    const collection = db.collection("general_inquiries");

    await collection.insertOne({
      user_id: new ObjectId(user.session._id),
      inquiry_subject,
      inquiry_message,
      inquiry_date: new Date(),
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
    });
  } catch (error) {
    console.error("AddGeneralInquiry.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { AddGeneralInquiry };
