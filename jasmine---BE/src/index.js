const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authRouter = require("../src/routes/AuthRouter");
const path = require("path");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// app.get("/", (req, res) => {
//   res.send("Hello world one");
// });

app.use(
  cors({
    origin:
      // process.env.NODE_ENV === "production"
        // ? "https://avocado-app.onrender.com" :
         "http://localhost:3000", // Cho phép cả local và production
    credentials: true, // Cho phép gửi cookie
  })
);

app.use(bodyParser.json());
app.use(express.json({ limit: "10000mb" }));
app.use(express.urlencoded({ limit: "10000mb", extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../../jasmine---FE/build")));

app.use("/api/auth", authRouter);
routes(app);

// Định tuyến mọi request không phải API về index.html của React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../jasmine---FE/build", "index.html"));
});

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Connect db successful");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log("Service is running in port: ", +port);
});
