const multer = require("multer");
const path = require("path");

// ── Storage for Category Images ───────────────────────────────────────────────
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/categories"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

// ── Storage for SubCategory Images ───────────────────────────────────────────
const subCategoryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/subcategories"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

// ── Storage for Service Images ────────────────────────────────────────────────
const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/services"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});

// ── Storage for Profile Images ────────────────────────────────────────────────
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/profiles"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});


// ── Exports ───────────────────────────────────────────────────────────────────
const categoryUpload = multer({ storage: categoryStorage });
const subCategoryUpload = multer({ storage: subCategoryStorage });
const serviceUpload = multer({ storage: serviceStorage });
const profileUpload = multer({ storage: profileStorage });

module.exports = {
  categoryUpload,
  subCategoryUpload,
  serviceUpload,
  profileUpload,
};
