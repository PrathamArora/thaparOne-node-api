const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var TeacherSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true,
    minlength : 1,
    trim : true
  } ,
  contactNumber : {
    type : String
  },
  employeeCode : {
    type : Number
  },
  departmentCode : {
    type : String
  },
  emailID : {
    type : String,
    minlength : 1,
    trim : true,
    unique : true,
    validate : {
      validator : (value) => {
        return validator.isEmail(value);
      },
      message : '{VALUE} used is not a valid email ID'
    }
  } ,
  lectureGroups : [{
    _courseID : {
      type : mongoose.Schema.Types.ObjectId
    } ,
    subsectionIDs : [{
      _subsectionID : {
        type : mongoose.Schema.Types.ObjectId
      }
    }]
  }],
  labGroups : [{
    _courseID : {
      type : mongoose.Schema.Types.ObjectId
    } ,
    subsectionIDs : [{
      _subsectionID : {
        type : mongoose.Schema.Types.ObjectId
      }
    }]
  }],
  tutorialGroups : [{
    _courseID : {
      type : mongoose.Schema.Types.ObjectId
    } ,
    subsectionIDs : [{
      _subsectionID : {
        type : mongoose.Schema.Types.ObjectId
      }
    }]
  }],
  tokens : [{
    access : {
      type : String,
      required : true
    },
    token : {
      type : String,
      required : true
    }
  }]
});

TeacherSchema.methods.toJSON = function(){
  var teacher = this;
  var teacherObj = teacher.toObject();

  return _.pick(teacherObj , ['employeeCode' , 'contactNumber' , 'departmentCode' , 'emailID' , 'labGroups' , 'lectureGroups' , 'name' , 'tutorialGroups' , '_id']);
};

TeacherSchema.methods.generateAuthToken = function() {
  var teacher = this;
  var access = 'auth';
  var token = jwt.sign({_id:teacher._id.toHexString() , access:access} , process.env.JWT_SECRET).toString();

  teacher.tokens = teacher.tokens.concat([{
    access : access ,
    token : token
  }]);

  return teacher.save().then(() => {
    return token;
  });
};

TeacherSchema.statics.findByCredentials = function(employeeCode){
  var Teacher = this;
  employeeCode = parseInt(employeeCode);

  return Teacher.findOne({
    employeeCode : employeeCode
  }).then((teacher) => {
    if(! teacher){
      return Promise.reject({'error' : 'Teacher not found. Contact the admin'});
    }

    return new Promise((resolve , reject) => {
      resolve(teacher);
    });
  });
};


TeacherSchema.statics.findByToken = function(token) {
  var Teacher = this;
  var decoded;

  try{
    decoded = jwt.verify(token , process.env.JWT_SECRET);

  }catch(e){
    return new Promise((resolve , reject) => {
      reject({'message' : 'Needs authentication' , 'status' : 401});
    });
  }

  return Teacher.findOne({
    '_id' : decoded._id,
    'tokens.token' : token ,
    'tokens.access' : 'auth'
  });
};








var Teacher = mongoose.model('Teacher' , TeacherSchema);

module.exports = {
  Teacher : Teacher
};
