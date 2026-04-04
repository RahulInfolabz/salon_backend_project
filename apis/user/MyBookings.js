const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function MyBookings(req, res) {
  try {
    const user = req.session.user;
    if (!user || !user.isAuth) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const db = await connectDB();
    const collection = db.collection("bookings");

    const bookings = await collection
      .aggregate([
        { $match: { user_id: new ObjectId(user.session._id) } },
        {
          $lookup: {
            from: "services",
            localField: "service_id",
            foreignField: "_id",
            as: "service",
          },
        },
        { $unwind: { path: "$service", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "service_categories",
            localField: "service.category_id",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        { $sort: { created_at: -1 } },
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    console.error("MyBookings.js: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = { MyBookings };
