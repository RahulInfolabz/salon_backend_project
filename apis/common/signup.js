const connectDB = require("../../db/dbConnect");

async function Signup(req, res) {
  try {
    const db = await connectDB();
    const userCollection = db.collection("users");

    const { full_name, email, password, mobile_no, city } = req.body;

    if (!full_name || !email || !password || !mobile_no || !city) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExist = await userCollection.findOne({
      $or: [{ email }, { mobile_no }],
    });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Email or mobile number already exists",
      });
    }

    await userCollection.insertOne({
      full_name,
      email,
      password,
      mobile_no,
      city,
      profile_image: "",
      role: "User",
      status: "Active",
      created_at: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
    });
  } catch (error) {
    console.error("signup.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { Signup };
