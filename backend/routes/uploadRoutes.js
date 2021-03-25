import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads/");
  },
  filename(req, file, callback) {
    callback(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const checkFileType = (file, callback) => {
  const fileTypes = /jpg|png|jpeg/;
  const extname = fileTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );

  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return callback(null, true);
  } else {
    return callback("Images only", false);
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, callback) {
    checkFileType(file, callback);
  },
});

router.post("/", upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`);
});

export default router;
