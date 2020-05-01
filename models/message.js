const mongoose=require("mongoose");

const Patient_schema=mongoose.Schema({
  doctor:String,
  name:String,
  number: Number,
  email: String,
  Date:Date,
  reason:String,
  prescription: String
});

const Patient=mongoose.model("Patient",Patient_schema);


const Doctor_schema=mongoose.Schema({
  name:String,
  email:String,
  phone:Number,
  userId: String,
  password:String
});

const Doctor=mongoose.model("Doctor",Doctor_schema);



module.exports={Patient,Doctor};
