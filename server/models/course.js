const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var CourseSchema = new mongoose.Schema({
  courseCode : {
    type : String
  } ,
  courseName : {
    type : String
  } ,
  subjectType : {
    type : String
  } ,
  subjectID : {
    type : Number
  } ,
  lecture : {
    type : Boolean ,
    default : false ,
    required : true
  } ,
  tutorial : {
    type : Boolean ,
    default : false,
    required : true
  } ,
  lab : {
    type : Boolean ,
    default : false,
    required : true
  }
});


var Course = mongoose.model('Course' , CourseSchema);

module.exports = {
  Course : Course
};
