const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Helper: Ensure folder exists ──────────────────────────────────────────────
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// ── Base Upload Path ──────────────────────────────────────────────────────────
const basePath = "uploads";

// Ensure all folders exist
const paths = {
  categories: path.join(basePath, "categories"),
  subcategories: path.join(basePath, "subcategories"),
  services: path.join(basePath, "services"),
  profiles: path.join(basePath, "profiles"),
};

Object.values(paths).forEach(ensureDir);

// ── Common filename logic ─────────────────────────────────────────────────────
const generateFileName = (file) => {
  return `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
};

// ── Storage Configs ───────────────────────────────────────────────────────────
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, paths.categories),
  filename: (req, file, cb) => cb(null, generateFileName(file)),
});

const subCategoryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, paths.subcategories),
  filename: (req, file, cb) => cb(null, generateFileName(file)),
});

const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, paths.services),
  filename: (req, file, cb) => cb(null, generateFileName(file)),
});

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, paths.profiles),
  filename: (req, file, cb) => cb(null, generateFileName(file)),
});

// ── Upload Middlewares ────────────────────────────────────────────────────────
const categoryUpload = multer({ storage: categoryStorage });
const subCategoryUpload = multer({ storage: subCategoryStorage });
const serviceUpload = multer({ storage: serviceStorage });
const profileUpload = multer({ storage: profileStorage });

// ── Exports ───────────────────────────────────────────────────────────────────
module.exports = {
  categoryUpload,
  subCategoryUpload,
  serviceUpload,
  profileUpload,
};