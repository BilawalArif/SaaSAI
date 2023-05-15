// connect env
require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
// connect database
const mongoose = require("mongoose");

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

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
app.use(express.json());

// connect our routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/openai", require("./routes/openai"));
app.use("/api/stripe", require("./routes/stripe"));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
