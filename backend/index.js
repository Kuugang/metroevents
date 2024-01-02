const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const port = 6969;
const bodyParser = require("body-parser");
const helmet = require("helmet");
const { initSocket } = require("./socket");

app.use(
  cors({
    origin:
      process.env.node_env == "production"
        ? "https://metroevents.vercel.app"
        : "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

app.use(cookieParser());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json());

app.use("/", require("./routes/mainRoutes"));
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
initSocket(server);