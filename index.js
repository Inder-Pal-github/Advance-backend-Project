const express = require('express');
const fs = require('fs');
const { connection } = require('./config/db');
const { verifyAccessToken } = require('./helpers/jwt.helpers');
const { userRouter } = require('./routes/user.routes');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/",(req,res)=>{
    res.send("Unit-Project");
});

app.use("/api/users",userRouter);

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