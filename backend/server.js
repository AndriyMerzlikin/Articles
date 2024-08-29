import express from "express";
import path from "path";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";

import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import { getMe, login, register } from "./controllers/userController.js";
import {
  create,
  getAll,
  getLasttags,
  getOne,
  remove,
  update,
} from "./controllers/postController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

const port = process.env.PORT || 4444;

connectDB();

const app = express();

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, "uploads");
  },
  filename: function (_, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// app.get("/", (req, res) => res.send("API is running..."));

app.post("/auth/login", loginValidation, handleValidationErrors, login);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  register
);
app.get("/auth/me", checkAuth, getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/", (req, res) => res.send("API is running..."));

app.get("/tags", getLasttags);

app.get("/posts", getAll);
app.get("/posts/tags", getLasttags);
app.get("/posts/:id", getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  create
);
app.delete("/posts/:id", checkAuth, remove);
app.patch("/posts/:id", checkAuth, handleValidationErrors, update);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "mern-blog-frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "mern-blog-frontend", "build", "index.html")
  );
});

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
