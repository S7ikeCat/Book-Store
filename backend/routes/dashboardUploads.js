const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const authenticate = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads", "books");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9_-]/gi, "_")
      .slice(0, 40);

    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeBase}-${unique}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype);
  cb(ok ? null : new Error("Only image files are allowed"), ok);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/dashboard/uploads/book-cover
router.post(
  "/book-cover",
  authenticate,
  adminOnly,
  upload.single("file"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // вернём имя файла и публичный URL
    return res.status(201).json({
      filename: req.file.filename,
      url: `/uploads/books/${req.file.filename}`,
    });
  }
);

module.exports = router;