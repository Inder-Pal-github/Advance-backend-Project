const express = require('express');
const path = require('path');
const { connection } = require('./config/db');
const { verifyAccessToken } = require('./helpers/jwt.helpers');
const { userRouter } = require('./routes/user.routes');
const cookieParser = require("cookie-parser");
const { GitHubLogin } = require('./controllers/github.controller');
const { mailRouter } = require('./routes/mail.routes');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/",(req,res)=>{
    res.send("Unit-Project");
});

app.get("/api/github",(req,res)=>{
  res.sendFile(path.join(__dirname,"views/github.html"));
});
app.get("/auth/github",GitHubLogin);

app.use("/api/users",userRouter);

app.use("/api/mail",mailRouter);

app.get("/api/info",verifyAccessToken,(req,res)=>{
  res.send("Important data");
})


app.listen(8080, async ()=>{
     try {
      await connection;
        console.log(`listening on http://localhost:8080`);
     } catch (error) {
        console.log(error.message);
     }
})