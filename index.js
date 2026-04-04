const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./db/dbConnect");
require("dotenv").config();

// ── Multer Instances ──────────────────────────────────────────────────────────
const {
  categoryUpload,
  subCategoryUpload,
  serviceUpload,
  profileUpload,
} = require("./multer/multer");

// ── Common APIs ───────────────────────────────────────────────────────────────
const Logout = require("./apis/common/logout");
const Session = require("./apis/common/session");
const { Login } = require("./apis/common/login");
const { Signup } = require("./apis/common/signup");
const { ChangePassword } = require("./apis/common/changePassword");

// ── Public APIs ───────────────────────────────────────────────────────────────
const { GetCategories } = require("./apis/user/GetCategories");
const { GetSubCategories } = require("./apis/user/GetSubCategories");
const { GetServices } = require("./apis/user/GetServices");
const { GetServiceDetails } = require("./apis/user/GetServiceDetails");
const { GetFeedbacks } = require("./apis/user/GetFeedbacks");

// ── User APIs ─────────────────────────────────────────────────────────────────
const { GetProfile } = require("./apis/user/GetProfile");
const { UpdateProfile } = require("./apis/user/UpdateProfile");
const { BookService } = require("./apis/user/BookService");
const { MyBookings } = require("./apis/user/MyBookings");
const { GenOrderId } = require("./apis/user/GenOrderId");
const { VerifyPayment } = require("./apis/user/VerifyPayment");
const { AddFeedback } = require("./apis/user/AddFeedback");
const { AddGeneralInquiry } = require("./apis/user/AddGeneralInquiry");
const { MyGeneralInquiries } = require("./apis/user/MyGeneralInquiries");

// ── Admin APIs ────────────────────────────────────────────────────────────────
const { GetUsers } = require("./apis/admin/GetUsers");

const { AddCategory } = require("./apis/admin/AddCategory");
const { UpdateCategory } = require("./apis/admin/UpdateCategory");
const { DeleteCategory } = require("./apis/admin/DeleteCategory");
const { GetAdminCategories } = require("./apis/admin/GetCategories");

const { AddSubCategory } = require("./apis/admin/AddSubCategory");
const { UpdateSubCategory } = require("./apis/admin/UpdateSubCategory");
const { DeleteSubCategory } = require("./apis/admin/DeleteSubCategory");
const { GetAdminSubCategories } = require("./apis/admin/GetSubCategories");

const { AddService } = require("./apis/admin/AddService");
const { UpdateService } = require("./apis/admin/UpdateService");
const { DeleteService } = require("./apis/admin/DeleteService");
const { GetAdminServices } = require("./apis/admin/GetServices");

const { GetBookings } = require("./apis/admin/GetBookings");
const { UpdateBooking } = require("./apis/admin/UpdateBooking");

const { GetPayments } = require("./apis/admin/GetPayments");
const { GetAdminFeedbacks } = require("./apis/admin/GetFeedbacks");
const { GetInquiries } = require("./apis/admin/GetInquiries");
const { CloseInquiry } = require("./apis/admin/CloseInquiry");

// ─────────────────────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "salon_platform_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ── Static File Serving ───────────────────────────────────────────────────────
app.use("/uploads/categories", express.static("uploads/categories"));
app.use("/uploads/subcategories", express.static("uploads/subcategories"));
app.use("/uploads/services", express.static("uploads/services"));
app.use("/uploads/profiles", express.static("uploads/profiles"));

// ── DB Connect ────────────────────────────────────────────────────────────────
connectDB();

// ─────────────────────────────────────────────────────────────────────────────
//  COMMON APIs
// ─────────────────────────────────────────────────────────────────────────────
app.post("/signup", Signup);
app.post("/login", Login);
app.get("/logout", Logout);
app.get("/session", Session);
app.post("/changePassword", ChangePassword);

// ─────────────────────────────────────────────────────────────────────────────
//  PUBLIC APIs (no auth required)
// ─────────────────────────────────────────────────────────────────────────────
app.get("/categories", GetCategories);
app.get("/subcategories", GetSubCategories);
// filters: ?category_id= ?subcategory_id= ?min_price= ?max_price=
app.get("/services", GetServices);
app.get("/services/:id", GetServiceDetails);
app.get("/feedbacks", GetFeedbacks);

// ─────────────────────────────────────────────────────────────────────────────
//  USER APIs (session required)
// ─────────────────────────────────────────────────────────────────────────────
app.get("/user/profile", GetProfile);
app.post("/user/updateProfile", profileUpload.single("profile_image"), UpdateProfile);
app.post("/user/bookService", BookService);
app.get("/user/myBookings", MyBookings);
app.post("/user/genOrderId", GenOrderId);
app.post("/user/verifyPayment", VerifyPayment);
app.post("/user/addFeedback", AddFeedback);
app.post("/user/addGeneralInquiry", AddGeneralInquiry);
app.get("/user/myGeneralInquiries", MyGeneralInquiries);

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN APIs (session required)
// ─────────────────────────────────────────────────────────────────────────────

// Users
app.get("/admin/users", GetUsers);

// Categories
app.post("/admin/addCategory", categoryUpload.single("category_image"), AddCategory);
app.post("/admin/updateCategory", categoryUpload.single("category_image"), UpdateCategory);
app.get("/admin/deleteCategory/:id", DeleteCategory);
app.get("/admin/categories", GetAdminCategories);

// SubCategories
app.post("/admin/addSubCategory", subCategoryUpload.single("subcategory_image"), AddSubCategory);
app.post("/admin/updateSubCategory", subCategoryUpload.single("subcategory_image"), UpdateSubCategory);
app.get("/admin/deleteSubCategory/:id", DeleteSubCategory);
app.get("/admin/subcategories", GetAdminSubCategories);

// Services
app.post("/admin/addService", serviceUpload.single("service_image"), AddService);
app.post("/admin/updateService", serviceUpload.single("service_image"), UpdateService);
app.get("/admin/deleteService/:id", DeleteService);
app.get("/admin/services", GetAdminServices);

// Bookings
app.get("/admin/bookings", GetBookings);
app.post("/admin/updateBooking", UpdateBooking);

// Reports
app.get("/admin/payments", GetPayments);
app.get("/admin/feedbacks", GetAdminFeedbacks);
app.get("/admin/inquiries", GetInquiries);
app.post("/admin/closeInquiry/:id", CloseInquiry);


app.get("/", (req, res) => {
  res.send("Welcome to Salon Service Platform API!");
});


// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () =>
  console.log(`✅ Salon Service Platform server started on PORT ${PORT}!`)
);
