const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var AttendanceSchema = new mongoose.Schema({
  _teacherID : {
    type : mongoose.Schema.Types.ObjectId
  } ,
  _courseID : {
    type : mongoose.Schema.Types.ObjectId
  } ,
  subjectType : {
    type : String
  } ,
  date : {
    type : String
  } ,
  remarks : {
    type : String
  } ,
  _subsectionIDs : [{
    _subsectionID : {
      type : mongoose.Schema.Types.ObjectId
    }
  }] ,
  presentStudentIDs : [{
    _studentID : {
      type : mongoose.Schema.Types.ObjectId
    }
  }] ,
  ltp : {
    type : String
  },
  startSession : {
    type : Number
  } ,
  endSession : {
    type : Number
  }
});

AttendanceSchema.statics.getSession = function(attendanceSession) {
  var Attendance = this;
  return Attendance.findOne({
    _id : attendanceSession
  }).then((session) =>{
    if(! session){
      return Promise.reject({'error' : 'Cannot find Attendance session'});
    }

    return new Promise((resolve , reject) => {
      resolve(session);
    });
  });
};

AttendanceSchema.statics.markAttendance = function(incomingTime , studentBody , decodedQRdata){
  var Attendance = this;
  var found = false;
  return Attendance.findOne({
    _id : decodedQRdata._id
  }).then((attendanceBody) => {
    if( ! attendanceBody){
      return Promise.reject({'error' : 'Cannot find Attendance Session'});
//      res.status(404).send({'error' : 'Cannot find Attendance Session'});
    }else{
      if(incomingTime >= attendanceBody.startSession && incomingTime <= attendanceBody.endSession){
        currentSubjects = studentBody['currSub'];
        for(var i = 0 ; i < currentSubjects.length ; i++){
          var subject = currentSubjects[i];
          if(subject['_courseID'].toString() === attendanceBody['_courseID'].toString()
              && subject['_teacherID'].toString() === attendanceBody['_teacherID'].toString()
              && subject['subjectType'].toString() === attendanceBody['subjectType'].toString()
              && subject['ltp'].toString() === attendanceBody['ltp'].toString()){

              var subsections = attendanceBody['_subsectionIDs'];
              for(var j = 0 ; j < subsections.length ; j++){
                var subsection = subsections[j];
                if(subject['_subsectionID'].toString() === subsection['_subsectionID'].toString()){
                  found = true;

                  var totalClasses = parseInt(subject['totalClasses']);
                  var classesAttended = parseInt(subject['classesAttended']);
                  // if(totalClasses == 0){
                  //   totalClasses = 1;
                  // }else{
                  //   totalClasses = totalClasses + 1;
                  // }
                  // if(classesAttended == 0){
                  //   classesAttended = 1;
                  // }else{
                  //   classesAttended = classesAttended + 1;
                  // }

                  // console.log('totalClasses ',totalClasses);
                  // console.log('classesAttended ',classesAttended);
                  var toBeInsertedInAttendance = {_studentID : studentBody._id , _id : studentBody._id};
                  // var totalClassesString = `currSub.${i}.totalClasses`;
                  // var classesAttendedString = `currSub.${i}.classesAttended`;
                  // console.log('totalClassesString ', totalClassesString);
                  // console.log('classesAttendedString ',classesAttendedString);
                  var matchedSubject = subject;
                  Attendance.findOneAndUpdate({
                    _id : decodedQRdata._id
                  } , {
                    $addToSet : {
                      presentStudentIDs : toBeInsertedInAttendance
                    }
                  } , {
                    new : true
                  }).then((updatedAttendance) =>{
                    if(! updatedAttendance){
                      return Promise.reject({'error' : 'Invalid Attendance Session.'});
//                      res.status(400).send({'error' : 'Invalid Attendance Session.'})
                    }
                    return new Promise((resolve , reject) => {
                      resolve({'message' : 'Your Attendance has been marked. Changes will be refelcted within a few minutes.'});
                    });
//                    res.status(200).send({'message' : 'Your Attendance has been marked. Changes will be refelcted within a few minutes.'});
                    // Student.findOneAndUpdate({
                    //   '_id' : studentBody['_id'],
                    //   'currSub._courseID' : ObjectID(matchedSubject['_courseID']),
                    //   'currSub._teacherID' : ObjectID(matchedSubject['_teacherID']),
                    //   'currSub.ltp' : matchedSubject['ltp'].toString(),
                    //   'currSub.subjectType' : matchedSubject['subjectType'].toString()
                    // } , {
                    //   $inc : {
                    //     'currSub.$.totalClasses' : 1 ,
                    //     'currSub.$.classesAttended' : 1
                    //   }
                    // } , {
                    //   new :true
                    // }).then((updatedStudent) => {
                    //   console.log('Updated student ',updatedStudent);
                    //   res.status(200).send(updatedStudent);
                    // }).catch((e) => {
                    //   res.status(400).send({'message' : 'Unable to update attendance'});
                    // });
                  });
//                   .catch((e) => {
//                     return Promise.reject({'error' : 'Unable to mark attendance'});
// //                    res.status(400).send({'error' : 'Unable to mark attendance'});
//                   });
                }
              }
          }
        }

        if(! found){
          return Promise.reject({'error' : 'Seems like you do not belong to this group'});
//          res.status(400).send({'error' : 'Seems like you do not belong to this group'});
        }
      }else{
        return Promise.reject({'error' : 'Attendance session has ended.'});
//        res.status(400).send({'error' : 'Attendance session has ended.'});
      }

    }
  });
};


var Attendance = mongoose.model('Attendance' , AttendanceSchema);

module.exports = {
  Attendance : Attendance
}
