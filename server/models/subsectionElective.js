const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var SubSectionElectiveSchema = new mongoose.Schema({
  subsectionCode : {
    type : String
  } ,
  academicYear : {
    type : Number
  } ,
  examCode : {
    type : String
  } ,
  programCodes : [{
    programCode : {
      type : String
    }
  }] ,
  branchCodes : [{
    branchCode : {
      type : String
    }
  }] ,
  _courseID: {
    type : mongoose.Schema.Types.ObjectId
  } ,
  _studentIDs : [{
    _studentID : {
      type : mongoose.Schema.Types.ObjectId
    }
  }]
});

SubSectionElectiveSchema.statics.getStudents = function(_subsectionID) {
  var SubSectionElective = this;
  return SubSectionElective.findOne({
    _id : _subsectionID
  }).then((subsection) => {
    if(! subsection){
      return Promise.reject({'error' : 'Unable to find group for Elective'});
    }
    return new Promise((resolve , reject) =>{
      resolve(subsection['_studentIDs']);
    });
  });
};


var SubSectionElective = mongoose.model('SubSectionElective' , SubSectionElectiveSchema);

module.exports = {
  SubSectionElective : SubSectionElective
};
