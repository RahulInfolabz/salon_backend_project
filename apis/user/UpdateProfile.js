const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateProfile(req, res) {
  try {
    const { user_id, full_name, mobile_no, city } = req.body;

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
    const collection = db.collection("users");

    // ✅ Prepare update fields
    const updateFields = { updated_at: new Date() };

    if (full_name) updateFields.full_name = full_name;
    if (mobile_no) updateFields.mobile_no = mobile_no;
    if (city) updateFields.city = city;

    // ✅ File upload (optional)
    if (req.file) {
      updateFields.profile_image = `/uploads/profiles/${req.file.filename}`;
    }

    // ✅ Update user
    const result = await collection.updateOne(
      { _id: new ObjectId(user_id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Success response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });

  } catch (error) {
    console.error("UpdateProfile.js: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { UpdateProfile };