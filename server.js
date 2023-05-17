// connect env
// require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const path = require("path");

// connect database
const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config.env" });
}
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};
app.use(bodyParser.json({ verify: rawBodySaver, extended: true }));

// connect database
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to Database`);
  })
  .catch((error) => console.log(`${error} did not connected`));

const PORT = process.env.PORT || 4002;

// connect our routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/openai", require("./routes/openai"));
app.use("/api/stripe", require("./routes/stripe"));

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
