const express = require("express");
const session = require("express-session");
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const CommentRouter = require("./routes/CommentRouter");
const LoginRegisterRouter = require("./routes/LoginRegisterRouter");
const app = express();
dbConnect();
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 30 * 1000, // In secs, Optional
    },
  })
);
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/photosOfUser", PhotoRouter);
app.use("/public", express.static("public/images"));
app.use("/api/comments", CommentRouter);
app.use("/api/loginRegister", LoginRegisterRouter);
app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
