const connectDB = require("../../db/dbConnect");

async function GetUsers(req, res) {
  try {
    const { role } = req.query;

    // ✅ Authorization (role from frontend)
    if (role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const db = await connectDB();
    const collection = db.collection("users");

    // ✅ Fetch users (exclude password)
    const users = await collection
      .find(
        { role: "User" },
        { projection: { password: 0 } }
      )
      .sort({ created_at: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });

  } catch (error) {
    console.error("GetUsers.js: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { GetUsers };