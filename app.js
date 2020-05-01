const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');


const check = require("./controllers/validations.js");
const msg=require("./models/message");
const search=[];


mongoose.connect("mongodb://localhost:27017/practicedb", {useNewUrlParser: true});

const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));


app.get("/", function(req,res){
  res.render("index");
});

app.post("/", function(req,res){
    if(req.body.button==="login"){
      check.Login(req.body.username,req.body.password,
      function(err, data){
        if(data===0){res.send("No user ID");}
        else {
        //  req.session.context =data.userId ;
          res.redirect("/dashboard/"+data.userId);
        }
      });
  }
else if(req.body.button==="signup"){
    check.SignUp(req.body.name,req.body.email,req.body.phone,req.body.userId,req.body.password,function(err,data){
      if(err)console.log("error");
      else if(data===0){  res.send(data);  }
      else  {
      console.log("inserted");
      res.redirect("/");
    }
    });
  }

});



app.get("/dashboard/:usrId", function(req,res){
let usrId=req.params.usrId;
check.Data(usrId,function(err,data){
res.render("dashboard",{name:(data.name),email:(data.email),number:(data.phone),usrid:(data.userId)});
});
});

app.get("/dashboard/addPatients/:usrId", function(req,res){
  let usrId=req.params.usrId;
 res.render("addPatients",{usrid:usrId});
});

app.post("/dashboard/addPatients/:usrId", function(req,res){
  let usrId=req.params.usrId;
  check.patientRec(req.body.patientName,req.body.phoneNum,req.body.email,req.body.reason, req.body.prescription, function(err,data){
    if(err){
      console.log("error")
    }
    else{
      res.redirect("/dashboard/"+usrId);
    }
  });


});

app.get("/dashboard/updatePatients/:usrId", function(req,res){
  let usrId=req.params.usrId;
  res.render("updatePatients",{usrid:usrId} );
});
app.post("/dashboard/updatePatients/:usrId", function(req,res){
  let usrId=req.params.usrId;
  check.updatePatient(req.body.pnoneNum,req.body.reason,req.body.prescription, function(err,data){
    if(err){
      console.log("error")
    }
    else{
      console.log(data);
      res.redirect("/dashboard/"+usrId);
    }
  });

});

app.get("/dashboard/search/:usrId",function(req,res){
let usrId=req.params.usrId;
 res.render("nodata",{error:"NO DATA FOUND, ENTERED PATIENT MAY NOT EXISTS!!!!",usrid:usrId});
 });

app.post("/dashboard/search/:usrId", function(req,res){
    let usrId=req.params.usrId;
    check.search(req.body.search, function(err,patient){
      if(err)
       res.render("nodata",{error:"some error in finding record, check ur search value", usrid:usrId});
      else if(patient==="no data"){
       res.render("nodata",{error:"NO DATA FOUND, ENTERED PATIENT MAY NOT EXISTS!!!!",usrid:usrId});
      }
      else{
        res.render("search", {patient:patient,usrid:usrId});
      }
    });
});

app.post("/test", function(req,res) {
   req.session.message = 'please login first'; //or whatever
    res.redirect('/test');
});
app.get('/test', function(req, res) {
   var message = req.session.message;
    console.log(message);
    res.render("test");
});

app.listen(3000);
