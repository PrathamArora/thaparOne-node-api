//require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const jwt = require('jsonwebtoken');


const {mongoose} = require('./db/mongoose.js');
const {ObjectID} = require('mongodb');
var {Student} = require('./models/student.js');
var {Course} = require('./models/course.js');
var {SubSectionCore} = require('./models/subsectionCore.js');
var {SubSectionElective} = require('./models/subsectionElective.js');
var {Attendance} = require('./models/attendance.js');
var {Teacher} = require('./models/teacher.js');
var {authenticateTeacher} = require('./middleware/authenticateTeacher.js');
var {authenticateStudent} = require('./middleware/authenticateStudent.js');

const port = process.env.PORT || 3000;
var app = express();
app.use(bodyParser.json());

// app.post('/student/initialiseStudents' , (req , res) => {
//   var studentsString = fs.readFileSync('C:/Node.js/thaparOne-node-api/server/jsonData/students.json');
//   studentsString = JSON.parse(studentsString);
//
//   for(i = 0 ; i < studentsString.length ; i++){
//     var student = studentsString[i];
//
//     var studentObj = new Student({
//       name : student['name'] ,
//       rollNumber : parseInt(student['rollNumber']) ,
//       studentContactNumber : student['studentContactNumber'] ,
//       parentContactNumber : student['parentContactNumber'] ,
//       branchCode : student['branchCode'] ,
//       programCode : student['programCode'] ,
//       studentEmailID : student['studentEmailID'] ,
//       parentEmailID : student['parentEmailID'] ,
//       currSub : [] ,
//       prevSub : [] ,
//       tokens : []
//     });
//
//     studentObj.save().then((studentSaved) => {
//       console.log(studentSaved);
//     }).catch((e) => {
//       console.log(e);
//     });
//   }
//   res.send();
//
// });

app.post('/teacher/takeAttendance' , authenticateTeacher , (req , res) => {
  var startSession = Math.round(new Date().getTime()/1000);
  var endSession = Math.round(new Date().getTime()/1000) + 1800;
  var attendance = new Attendance({
    _teacherID : req.teacher._id ,
    _courseID : req.body._courseID ,
    subjectType : req.body.subjectType ,
    date : new Date().toLocaleString() ,
    remarks : req.body.remarks ,
    _subsectionIDs : req.body._subsectionIDs ,
    ltp : req.body.ltp ,
    startSession : startSession ,
    endSession : endSession
  });

  attendance.save().then((newSession) => {
    var QRcode = jwt.sign({_id:newSession._id.toHexString()} , 'thaparOne').toString();
    res.send({'attendanceSession' : QRcode});
  } , (e) => {
    res.status(400).send({'error' : 'Cannot create session'});
  });
});


app.post('/teacher/login' , (req , res) => {
  console.log(req.body);
  var body = _.pick(req.body , ['employeeCode']);

  Teacher.findByCredentials(body.employeeCode).then((teacher) => {
    if(! teacher){
      res.status(404).send({'error':'Teacher not found. Contact the admin'});
    }

    return teacher.generateAuthToken().then((token) => {
      res.header('x-auth' , token).send(teacher);
    });
    res.status(200).send(teacher);
  }).catch((e) => {
    console.log(e);
    res.status(400).send({'error' : 'Invalid Employee Code'});
  });
});

app.post('/student/markAttendance' , authenticateStudent , (req , res) => {
  var incomingTime = Math.round(new Date().getTime()/1000);
  var body = _.pick(req.body , ['QRcodeData']);
  var studentBody = _.pick(req.student , ['name', 'rollNumber', 'studentContactNumber', 'parentContactNumber', 'branchCode', 'programCode', 'studentEmailID', 'parentEmailID', 'currSub', 'prevSub' , '_id']);

  var decodedQRdata;

  try{
    decodedQRdata = jwt.verify(body.QRcodeData , 'thaparOne');
    Attendance.markAttendance(incomingTime , studentBody , decodedQRdata).then((status) => {
      res.status(200).send({'message' : 'Your Attendance has been marked. Changes will be refelcted within a few minutes.'});
    }).catch((e) => {
      console.log(e);
      res.status(400).send({'error' : 'Attendance session has ended.'});
    });
  }catch(e) {
    console.log(e);
    res.status(400).send({'error' : 'Invalid QR code.'});
  }
});

app.post('/teacher/updateAttendance' , (req , res) => {

  var body = _.pick(req.body , ['attendanceSession']);

  var decodedQRdata;

  try{
    decodedQRdata = jwt.verify(body.attendanceSession , 'thaparOne');
    Attendance.getSession(decodedQRdata).then((attendanceSession) => {
      if(attendanceSession['subjectType'] === 'E'){
        attendanceSession['_subsectionIDs'].forEach(function(subsection){
          _subsectionID = subsection['_subsectionID'];
          SubSectionElective.getStudents(_subsectionID).then((allStudents) =>{
            // console.log(JSON.stringify(attendanceSession , undefined , 2));
            // console.log(JSON.stringify(allStudents , undefined , 2));
            console.log(JSON.stringify(attendanceSession['presentStudentIDs'] , undefined , 2));
            Student.markAttendance(attendanceSession , allStudents , attendanceSession['presentStudentIDs']).then((message) =>{
              res.send(message);
              console.log(attendanceSession);
            }).catch((e)=> {
              console.log(e);
              res.status(400).send({'error' : 'Unable to mark attendance'});
            });
          }).catch((e) => {
            console.log(e);
            res.status(400).send({'error' : 'Unable to fetch students'});
          });
        });
      }else if(attendanceSession['subjectType'] === 'C'){

      }
//      res.send(attendanceSession);
    }).catch((e) => {
      console.log(e);
      res.status(400).send({'error' : 'Unable to find Attendance Session.'});
    });

  }catch(e){
    res.status(400).send({'error' : 'Invalid Attendance Session.'});
  }
});



app.post('/student/login' , (req , res) => {
  console.log(req.body);
  var body = _.pick(req.body , ['rollNumber']);
  // Student.findOne({
  //   rollNumber : body.rollNumber
  // }).then((student) => {
  //   if(!student){
  //     res.status(404).send({'error' : 'Not Found'});
  //   }
  //   res.send(student);
  // }).catch((e) => {
  //   res.status(400).send(e);
  // });

  Student.findByCredentials(body.rollNumber).then((student) => {
    if(!student){
      res.status(404).send({'error':'Student not found. Contact the admin'});
    }
    if(student.tokens.length > 0){
      res.status(400).send({'error' : 'Multiple logins are not allowed.'});
    }else{
      return student.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(student);
      });
    }
//    res.send(student);
  }).catch((e) => {
    res.status(400).send({'error' : 'Invalid Roll Number.'});
  });
});


app.get('/courses/:courseCode' , (req , res) => {
  var courseCode = req.params.courseCode;

  Course.findOne({
    courseCode : courseCode
  }).then((course) => {
    if(! course){
      res.status(404).send({'error' : 'Course code does not exist.'});
    }

    res.status(200).send(course);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

// app.post('/subsectioncore' , (req , res) => {
//   var subsection = new SubSectionCore({
//     subsectionCode : '3CO12' ,
//     _courseIDs : [] ,
//     _studentIDs : [] ,
//     academicYear : 1516 ,
//     branchCodes : [] ,
//     examCode : '1718EVESEM' ,
//     programCodes : []
//   });
//
//   subsection.save().then((subsec) => {
//     res.send(subsec);
//   }).catch((e) => {
//     res.send(e);
//   });
// });













app.listen(port , () =>{
  console.log(`Started on port ${port}`);
});


module.exports = {
  app : app
};
