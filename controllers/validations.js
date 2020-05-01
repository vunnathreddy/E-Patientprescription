
const mongoose = require("mongoose");
const msg =require("../models/message");

//check for Valid User
//first check weather valid username ...
//Check weather it matches to password...

function Login(username,password,callback){
  var data= msg.Doctor.findOne({userId:username},function(err, find){
  if(err){
    callback(err,null)
    console.log("error");
  }
  else
  if(find){
      if(find.password===password){
      callback(null,find)
      }
      else{
      callback(null, "INVALID PASSWORD!!")
      }
  }
  else{
      callback(null,"USER NAME NOT FOUND, SIGN UP BEFORE LOGGIN IN" );
      }
  });
}




function Data(userName,callback){
  var data= msg.Doctor.findOne({userId:userName},function(err, find){
  if(err){
    callback(err)
  }
  else if(find){
      callback(null,find)
    }
  else{
    console.log("no user id or something");
  }
  });
}
function PatientData(username, callback){
  var data=msg.Patient.find({userId:username}, function(err,find){
    if(err){
      console.log("error");
    }
    else{
      console.log(find)

    }
  });


}




function SignUp(name,email,phone, userId, password,callback){

  phone=parseInt(phone);

  var data= msg.Doctor.findOne({userId:userId},function(err, find){

    if(find){
      callback(null, "USER NAME ALREADY EXISTS");
      }
    else{
      var user=new msg.Doctor({
        name:name,
        email:email,
        phone:phone,
        userId:userId+"ehr.com",
        password:password
      });
      user.save();
      callback(null, user);
 }
});
}

function patientRec(name,phone,email,reason, prescription,doctorid,callback){
  let d = new Date().toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  var patient=new msg.Patient({
    doctor:doctorid,
    name:name,
    number: phone,
    email: email,
    Date:d,
    reason:reason,
    prescription:prescription
  });
  patient.save();
  callback(null,d);
}

function updatePatient(number,reason,prescription,doctorid,callback){
number=parseInt(number)
let d = new Date().toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
var data=msg.Patient.findOne({number:number,doctor:doctorid}, function(err, data){
if(data){
  let updatePatient = new msg.Patient({
    doctor:doctorid,
    name:data.name,
    number:data.number,
    email:data.email,
    Date:d,
    reason:reason,
    prescription:prescription
  });
  updatePatient.save();
  callback(null, "new Record added for the patient");
}
else if(err){  callback(err); }
else{
  callback(null, "No Existing record, should be added first")
}
});
}



function search(searchVal,doctorId,callback){
  searchVal=parseInt(searchVal);
  var data= msg.Patient.find({number:searchVal,doctor:doctorId},function(err,patient){
    if(err){
      callback(err);
    }
    else if(patient.length==0){
      console.log("no data");
      callback(null, "no data")

    }
    else{
      callback(null, patient);
    }
  });
}



module.exports={Login,SignUp,Data,patientRec,updatePatient,search,PatientData};
