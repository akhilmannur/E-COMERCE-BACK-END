const multer = require("multer");
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  destination: "uploads/",
});
const uploads = multer({ storage: storage });
const cloudinary = require("../utils/cloudinary");

const upload = (req, res, next) => {
  uploads.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "product-images",
      });

      req.body.image = result.secure_url;
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error uploading file to Cloudinary." });
    }
  });
};

module.exports = upload;
