require("dotenv").config();
const express = require("express");
const app = express();
const port  =5000;
const userRoute=require("./routes/userRoutes");
const adminRoute = require("./routes/adminRoutes");




app.use(express.json());



app.use('/api/users',userRoute)
app.use("/api/admin", adminRoute);



app.listen(port,(err)=>{

    if(err){
        console.log("some thing went wrong")
    }
  console.log("listening on port"+port);

})