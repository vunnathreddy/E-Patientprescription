//predefined packages....
//Require before using....
//these packages needs to install them using npm...

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');

// USER DEFINED PACKAGES
// CREATED AND STORED IN THIS PROJECCT.
//CHECK IN DIRECTORIES.

const check = require("./controllers/validations.js");
const msg=require("./models/message");
const search=[];

//CONNECTING TO EHR_DB DATABASE.
//MONGODB IS LISTENING TO LOCAL PORT:27017
mongoose.connect("mongodb://localhost:27017/EHR_DB", {useNewUrlParser: true});

const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));



// ROOT PAGE GET METHOD
app.get("/", function(req,res){
  res.render("index");
});

//ROOT PAGE POST METHOD
app.post("/", function(req,res){
  // check for button value in home page
    if(req.body.button==="login"){
      //checking for valid user
      check.Login(req.body.username,req.body.password,
      function(err, data){
        if(data==="USER NAME NOT FOUND, SIGN UP BEFORE LOGGIN IN"){
          res.render("V_USER",{error:data});
        }
        else if(data==="INVALID PASSWORD!!"){
          res.render("V_USER", {error:data})
        }
        //on Successfull user validation redirect to dashboard
        else {
        //  req.session.context =data.userId ;
          res.redirect("/dashboard/"+data.userId);
        }
      });
    }
    else if(req.body.button==="signup"){
      // if new user sign up with required fields
      if(req.body.password===req.body.cpassword){
        check.SignUp(req.body.name,req.body.email,req.body.phone,req.body.userId,req.body.password,function(err,data){
          if(err){
            res.render("V_USER",{error: "ERROR OCCURED NOT ABLE TO CREATE USER, TRY AGIAN!"});
          }
          else if(data==="USER NAME ALREADY EXISTS") {
            res.render("V_USER",{error: data});
          }
          else  {
              console.log("inserted")
              res.redirect("/");
            }
          });
        }
    else{
      res.render("V_USER",{error: "PASSWORD DID NOT MATCH!!!!"})
    }
  }

});




//Dashboard get request
app.get("/dashboard/:usrId", function(req,res){
let usrId=req.params.usrId;

check.Data(usrId,function(err,data){
  res.render("dashboard",{name:(data.name),email:(data.email),number:(data.phone),usrid:(data.userId)});
});
});

//ADD PATIENTS, CAN ADD ADD NEW PATIENTS

//ADD PATIENTS GET REQUEST..
app.get("/dashboard/addPatients/:usrId", function(req,res){
  let usrId=req.params.usrId;
 res.render("addPatients",{usrid:usrId});
});


// ADD PATIENTS POST REQUEST..
app.post("/dashboard/addPatients/:usrId", function(req,res){
  let usrId=req.params.usrId;
  check.patientRec(req.body.patientName,req.body.phoneNum,req.body.email,req.body.reason, req.body.prescription,usrId, function(err,data){
    if(err){
      console.log("error")
      }
    else{
      res.redirect("/dashboard/"+usrId);
    }
  });
});


//UPDATE PATIENTS, CAN UPDATE THE EXISTING RECORD.
//GET REQUEST FOR UPDATE PATIENT
app.get("/dashboard/updatePatients/:usrId", function(req,res){
  let usrId=req.params.usrId;
  res.render("updatePatients",{usrid:usrId} );
});

//POST REQUEST FOR UPDATE PATIENT..
app.post("/dashboard/updatePatients/:usrId", function(req,res){
  let usrId=req.params.usrId;
  check.updatePatient(req.body.pnoneNum,req.body.reason,req.body.prescription,usrId,function(err,data){
    if(err){
      console.log("error")
      }
    else{
      console.log(data);
      res.redirect("/dashboard/"+usrId);
    }
  });
});



//SEARCH FOR A PATEINT RECORD.
//GET REQUEST FOR SEARCH.
app.get("/dashboard/search/:usrId",function(req,res){
let usrId=req.params.usrId;
 res.render("nodata",{error:"NO DATA FOUND, ENTERED PATIENT MAY NOT EXISTS!!!!",usrid:usrId});
 });

//POST REQUEST FOR SEARCH.
app.post("/dashboard/search/:usrId", function(req,res){
    let usrId=req.params.usrId;
    check.search(req.body.search, usrId,function(err,patient){
      if(err){
        res.render("nodata",{error:"some error in finding record, check ur search value", usrid:usrId});
      }
      else if(patient==="no data"){
       res.render("nodata",{error:"NO DATA FOUND, ENTERED PATIENT MAY NOT EXISTS!!!!",usrid:usrId});
      }
      else{
        res.render("search", {patient:patient,usrid:usrId});
      }
    });
});



// LISTENING ON PORT:3000
app.listen(3000);
