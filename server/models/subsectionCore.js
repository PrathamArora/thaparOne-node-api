const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var SubSectionCoreSchema = new mongoose.Schema({
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
  _courseIDs : [{
    _courseID: {
      type : mongoose.Schema.Types.ObjectId
    }
  }] ,
  _studentIDs : [{
    _studentID : {
      type : mongoose.Schema.Types.ObjectId
    }
  }]
});



var SubSectionCore = mongoose.model('SubSectionCore' , SubSectionCoreSchema);

module.exports = {
  SubSectionCore : SubSectionCore
};
