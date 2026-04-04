const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function GetProfile(req, res) {
  try {
    const { user_id } = req.query;

    const db = await connectDB();
    const profile = await db.collection("users").findOne(
      { _id: new ObjectId(user_id) },
      { projection: { password: 0 } }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { GetProfile };
