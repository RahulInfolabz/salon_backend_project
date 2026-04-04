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

// ── File Filter (images only) ─────────────────────────────────────────────────
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)"));
  }
};

// ── Exports ───────────────────────────────────────────────────────────────────
const categoryUpload = multer({ storage: categoryStorage, fileFilter: imageFilter });
const subCategoryUpload = multer({ storage: subCategoryStorage, fileFilter: imageFilter });
const serviceUpload = multer({ storage: serviceStorage, fileFilter: imageFilter });
const profileUpload = multer({ storage: profileStorage, fileFilter: imageFilter });

module.exports = {
  categoryUpload,
  subCategoryUpload,
  serviceUpload,
  profileUpload,
};
