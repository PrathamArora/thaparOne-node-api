const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var StudentSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true,
    minlength : 1,
    trim : true
  } ,
  rollNumber : {
    type : Number,
    required : true,
    trim : true
  } ,
  studentContactNumber : {
    type : String
  },
  parentContactNumber : {
    type : String
  },
  branchCode : {
    type : String,
    required : true
  } ,
  programCode : {
    type : String,
    required : true
  } ,
  studentEmailID : {
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
  parentEmailID : {
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

  currSub : [{
    _courseID : {
      type : mongoose.Schema.Types.ObjectId
    },
    _teacherID : {
      type : mongoose.Schema.Types.ObjectId
    },
    _subsectionID : {
      type : mongoose.Schema.Types.ObjectId
    },
    subjectType : {
      type : String
    },
    ltp : {
      type : String
    } ,
    totalClasses : {
      type : Number
    },
    classesAttended : {
      type : Number
    }
  }],
  prevSub : [{
    _courseID : {
      type : mongoose.Schema.Types.ObjectId
    },
    _teacherID : {
      type : mongoose.Schema.Types.ObjectId
    },
    _subsectionID : {
      type : mongoose.Schema.Types.ObjectId
    },
    subjectType : {
      type : String
    },
    ltp : {
      type : String
    } ,
    totalClasses : {
      type : Number
    },
    classesAttended : {
      type : Number
    }
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

StudentSchema.methods.toJSON = function() {
  var student = this;
  var studentObject = student.toObject();

  return _.pick(studentObject , ['name', 'rollNumber', 'studentContactNumber', 'parentContactNumber', 'branchCode', 'programCode', 'studentEmailID', 'parentEmailID', 'currSub', 'prevSub' , '_id' , 'tokens']);
};

StudentSchema.statics.findByCredentials = function(rollNumber) {
  var Student = this;
  rollNumber = parseInt(rollNumber);

  return Student.findOne({
    rollNumber : rollNumber
  }).then((student) => {
    if(! student){
      return Promise.reject({'error' : 'Student not found. Contact the admin'});
    }

    return new Promise((resolve , reject) => {
      resolve(student);
    });
  });
};

StudentSchema.methods.generateAuthToken = function() {
  var student = this;
  var access = 'auth';
  var token = jwt.sign(
    {
    _id:student._id.toHexString() ,
    access:access
  }
     , process.env.JWT_SECRET).toString();

  student.tokens = student.tokens.concat([{
    access: access ,
    token : token
  }]);

  return student.save().then(() => {
    return token;
  });
};

// {
//   "_subsectionIDs": [
//     {
//       "_id": "5ad9be0fdee81b38403317cd",
//       "_subsectionID": "5ad6dcdc1c60983db734b90e"
//     }
//   ],
//   "presentStudentIDs": [
//     {
//       "_studentID": "5ad6dc9d94107154246b119e",
//       "_id": "5ad6dc9d94107154246b119e"
//     }
//   ],
//   "_id": "5ad9be0fdee81b38403317cc",
//   "_teacherID": "5ad6dccc1c60983db734b8f7",
//   "_courseID": "5ad6dcb61c60983db734b8e3",
//   "subjectType": "E",
//   "date": "2018-4-20 15:46:47",
//   "remarks": "Lesson 1",
//   "ltp": "L",
//   "startSession": 1524219408,
//   "endSession": 1524221208,
//   "__v": 0
// }

StudentSchema.statics.markAttendance = function(attendanceSession , allStudents , presentStudents){
  var Student = this;


  var allStudentsPromise;
  var i = 0;
  allStudents.forEach(function(student){
    Student.findOneAndUpdate({
      _id : student['_studentID'] ,
      'currSub._courseID' : attendanceSession['_courseID'] ,
      'currSub._teacherID' : attendanceSession['_teacherID'] ,
      'currSub.ltp' : attendanceSession['ltp'] ,
      'currSub.subjectType' : attendanceSession['subjectType']
    } , {
      $inc : {
        'currSub.$.totalClasses' : 1
      }
    } , {
      new : true
    }).then((updatedStudent) => {
      console.log('Lectures incremented for ', updatedStudent['name']);
      i = i + 1;
      if(i == allStudents.length){
        allStudentsPromise = new Promise((resolve , reject) => {
          resolve({'message' : 'Lecture count has been incremented for all Students'});
        });
      }
    }).catch((e) => {
      console.log('Could not increment for ', student['_studentID']);
    });
  });



  var presentStudentsPromise;
  var j = 0;
  presentStudents.forEach(function(student){
    Student.findOneAndUpdate({
      _id : student['_studentID'] ,
      'currSub._courseID' : attendanceSession['_courseID'] ,
      'currSub._teacherID' : attendanceSession['_teacherID'] ,
      'currSub.ltp' : attendanceSession['ltp'] ,
      'currSub.subjectType' : attendanceSession['subjectType']
    } , {
      $inc : {
        'currSub.$.classesAttended' : 1
      }
    } , {
      new : true
    }).then((updatedStudent) => {
      console.log('Classes attended incremented for ', updatedStudent['name']);
      j = j + 1;
      if(j == presentStudents.length){
        presentStudentsPromise = new Promise((resolve , reject) => {
          resolve({'message' : 'Classes attended count has been incremented for present Students'});
        });
      }
    }).catch((e) => {
      console.log('Could not increment classes attended for ',student['_studentID']);
    });
  });


  return Promise.all([allStudentsPromise , presentStudentsPromise]).then(function(values){
    return new Promise((resolve , reject) => {
      resolve({'message' : 'Attendance has been updated. We hope, we did not take much of your time'});
    });
  });

};


StudentSchema.statics.findByToken = function(token) {
  var Student = this;
  var decoded;

  try{
    decoded = jwt.verify(token , process.env.JWT_SECRET);
  }catch(e){
    return new Promise((resolve , reject) => {
      reject({'message' : 'Needs authentication' , 'status' : 401});
    });
  }

  return Student.findOne({
    '_id' : decoded._id,
    'tokens.token' : token ,
    'tokens.access' : 'auth'
  });
};




var Student = mongoose.model('Student' , StudentSchema);

module.exports = {
  Student : Student
};
