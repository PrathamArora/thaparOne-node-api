 const fs = require('fs');
var XLSX = require('xlsx');
var workbook = XLSX.readFile('./playground/all data.xlsx');
var sheet_name_list = workbook.SheetNames;
fs.writeFileSync('./playground/all_data.json' , JSON.stringify(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]) , undefined , 2) );


const {MongoClient , ObjectID} = require('mongodb');

const dbName = 'thaparOne';

MongoClient.connect('mongodb://localhost:27017' , (err , client) => {
  if( err ){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  var allDataString = fs.readFileSync('./playground/all_data.json');
  allDataString = JSON.parse(allDataString);

  var i = allDataString.length - 1;

  allDataString.forEach(function(dataString){

    var teacherObj = client.db(dbName).collection('teachers').findOne({
      employeeCode : parseInt(dataString['EMPLOYEECODE'])
    }).then((teacherO) => {
      if(! teacherO){
        return Promise.reject();
      }

      return new Promise((resolve , reject) => {
        resolve(teacherO);
      });
    });


    var courseObj = client.db(dbName).collection('courses').findOne({
      subjectID : parseInt(dataString['SUBJECTID'])
    }).then((courseO) => {
      if(! courseO){
        return Promise.reject();
      }

      return new Promise((resolve , reject) => {
        resolve(courseO);
      });
    });

    var studentObj = client.db(dbName).collection('students').findOne({
      rollNumber : parseInt(dataString['ENROLLMENTNO'])
    }).then((studentO) => {
      if(! studentO){
        return Promise.reject();
      }

      return new Promise((resolve , reject) => {
        resolve(studentO);
      });
    });

    Promise.all([teacherObj , courseObj , studentObj]).then(function(values) {
//      console.log('Inside promise all');
      // console.log(values[0]['name']);
      // console.log(values[1]['courseCode']);
      // console.log(values[2]['name']);
      var teacher = values[0];
      var course = values[1];
      var student = values[2];

      console.log(JSON.stringify(teacher , undefined , 2));
      console.log(JSON.stringify(course , undefined , 2));
      console.log(JSON.stringify(student , undefined , 2));

      if(dataString['SUBJECTTYPE'] === 'C'){
        var subsectionObj = client.db(dbName).collection('subsectioncores').findOne({
          subsectionCode : dataString['SUBSECTIONCODE']
        }).then((subsectionO) => {
          if(! subsectionO){
            return Promise.reject();
          }

          return new Promise((resolve , reject) => {
            resolve(subsectionO);
          });
        });

        subsectionObj.then((subsection) => {
          console.log(subsection);
          var toBeInsertedInStudent = {
            _courseID : course['_id'] ,
            _teacherID : teacher['_id'] ,
            _subsectionID : subsection['_id'] ,
            subjectType : course['subjectType'] ,
            ltp : dataString['LTP'] ,
            totalClasses : 0 ,
            classesAttended : 0
          };
          var toBeInsertedInSubsection = {
            _studentID : student['_id']
          };

          var teacherUpdated = null;
          if(dataString['LTP'] === 'L'){       // Lecture
            var toBeInsertedInteachers = {
              _subsectionID : subsection['_id']
            };

            teacherUpdated = client.db(dbName).collection('teachers').findOneAndUpdate({
              _id : teacher['_id']
            } , {
              $addToSet : {
                lectureGroups : {
                  _courseID : course['_id'] ,
                  subsectionIDs : [{
                    _subsectionID : subsection['_id']
                  }]
                }
              }
            } , {
              upsert : true
            }).then((teacherO) => {
              if(! teacherO){
                return Promise.reject();
              }
              return new Promise((resolve , reject) => {
                resolve(teacherO);
              });
            });

          }else if(dataString['LTP'] === 'P'){ // Lab
            var toBeInsertedInTeacher = {
              _subsectionID : subsection['_id']
            };

            teacherUpdated = client.db(dbName).collection('teachers').findOneAndUpdate({
              _id : teacher['_id']
            } , {
              $addToSet : {
                labGroups : {
                  _courseID : course['_id'] ,
                  subsectionIDs : [{
                    _subsectionID : subsection['_id']
                  }]
                }
              }
            } , {
              upsert : true
            }).then((teacherO) => {
              if(! teacherO){
                return Promise.reject();
              }
              return new Promise((resolve , reject) => {
                resolve(teacherO);
              });
            });

          }else{                              // Tutorial
            var toBeInsertedInTeacher = {
              _subsectionID : subsection['_id']
            };

            teacherUpdated = client.db(dbName).collection('teachers').findOneAndUpdate({
              _id : teacher['_id']
            } , {
              $addToSet : {
                tutorialGroups : {
                  _courseID : course['_id'] ,
                  subsectionIDs : [{
                    _subsectionID : subsection['_id']
                  }]
                }
              }
            } , {
              upsert : true
            }).then((teacherO) => {
              if(! teacherO){
                return Promise.reject();
              }
              return new Promise((resolve , reject) => {
                resolve(teacherO);
              });
            });
          }

          var studentUpdated = client.db(dbName).collection('students').findOneAndUpdate({
            _id : student['_id']
          } , {
            $push : {
              currSub : toBeInsertedInStudent
            }
          } , {
            upsert : true,
            returnOriginal : false
          }).then((studentO) => {
            if(! studentO){
              return Promise.reject();
            }
            return new Promise((resolve , reject) => {
              resolve(studentO);
            });
          });

          var subsectionUpdated = client.db(dbName).collection('subsectioncores').findOneAndUpdate({
            _id : subsection['_id']
          } , {
            $addToSet : {
              _studentIDs : toBeInsertedInSubsection
            }
          } , {
            upsert : true,
            returnOriginal : false
          }).then((subsectionO) => {
            if(! subsectionO){
              return Promise.reject();
            }
            return new Promise((resolve , reject) => {
              resolve(subsectionO);
            });
          });

          Promise.all([teacherUpdated , studentUpdated , subsectionUpdated]).then(function(updatedValues) {
            console.log('Updated All');

            i = i - 1;
            if(i == 0){
              client.close();
            }

          }).catch((e) => {
            console.log(e);
          });

        }).catch((e) => {
          console.log(e);
        });
      }else if(dataString['SUBJECTTYPE'] === 'E'){
        console.log('Inside Elective Block');
        var subsectionObj = client.db(dbName).collection('subsectionelectives').findOne({
          subsectionCode : dataString['SUBSECTIONCODE'] ,
          _courseID : ObjectID(course['_id'])
        }).then((subsectionO) => {
          if(! subsectionO){
            return Promise.reject();
          }

          return new Promise((resolve , reject) => {
            resolve(subsectionO);
          });
        });

        var searchingSubsection = {subsectionCode : dataString['SUBSECTIONCODE'] , _courseID : course['_id']};
        console.log(JSON.stringify(searchingSubsection , undefined , 2));

        subsectionObj.then((subsection) => {
          console.log(subsection);
          var toBeInsertedInStudent = {
            _courseID : course['_id'] ,
            _teacherID : teacher['_id'] ,
            _subsectionID : subsection['_id'] ,
            subjectType : course['subjectType'] ,
            ltp : dataString['LTP'] ,
            totalClasses : 0 ,
            classesAttended : 0
          };
          var toBeInsertedInSubsection = {
            _studentID : student['_id']
          };

          var teacherUpdated = null;
          if(dataString['LTP'] === 'L'){       // Lecture
            var toBeInsertedInTeacher = {
              _subsectionID : subsection['_id']
            };

            teacherUpdated = client.db(dbName).collection('teachers').findOneAndUpdate({
              _id : teacher['_id']
            } , {
              $addToSet : {
                lectureGroups : {
                  _courseID : course['_id'] ,
                  subsectionIDs : [{
                    _subsectionID : subsection['_id']
                  }]
                }
              }
            } , {
              upsert : true
            }).then((teacherO) => {
              if(! teacherO){
                return Promise.reject();
              }
              return new Promise((resolve , reject) => {
                resolve(teacherO);
              });
            });

          }else if(dataString['LTP'] === 'P'){ // Lab
            var toBeInsertedInTeacher = {
              _subsectionID : subsection['_id']
            };

            teacherUpdated = client.db(dbName).collection('teachers').findOneAndUpdate({
              _id : teacher['_id']
            } , {
              $addToSet : {
                labGroups : {
                  _courseID : course['_id'] ,
                  subsectionIDs : [{
                    _subsectionID : subsection['_id']
                  }]
                }
              }
            } , {
              upsert : true
            }).then((teacherO) => {
              if(! teacherO){
                return Promise.reject();
              }
              return new Promise((resolve , reject) => {
                resolve(teacherO);
              });
            });

          }else{                              // Tutorial
            var toBeInsertedInTeacher = {
              _subsectionID : subsection['_id']
            };

            teacherUpdated = client.db(dbName).collection('teachers').findOneAndUpdate({
              _id : teacher['_id']
            } , {
              $addToSet : {
                tutorialGroups : {
                  _courseID : course['_id'] ,
                  subsectionIDs : [{
                    _subsectionID : subsection['_id']
                  }]
                }
              }
            } , {
              upsert : true
            }).then((teacherO) => {
              if(! teacherO){
                return Promise.reject();
              }
              return new Promise((resolve , reject) => {
                resolve(teacherO);
              });
            });
          }

          var studentUpdated = client.db(dbName).collection('students').findOneAndUpdate({
            _id : student['_id']
          } , {
            $push : {
              currSub : toBeInsertedInStudent
            }
          } , {
            upsert : true,
            returnOriginal : false
          }).then((studentO) => {
            if(! studentO){
              return Promise.reject();
            }
            return new Promise((resolve , reject) => {
              resolve(studentO);
            });
          });

          var subsectionUpdated = client.db(dbName).collection('subsectionelectives').findOneAndUpdate({
            _id : subsection['_id']
          } , {
            $addToSet : {
              _studentIDs : toBeInsertedInSubsection
            }
          } , {
            upsert : true,
            returnOriginal : false
          }).then((subsectionO) => {
            if(! subsectionO){
              return Promise.reject();
            }
            return new Promise((resolve , reject) => {
              resolve(subsectionO);
            });
          });

          Promise.all([teacherUpdated , studentUpdated , subsectionUpdated]).then(function(updatedValues) {
            console.log('Updated All');

            i = i - 1;
            if(i == 0){
              client.close();
            }

          }).catch((e) => {
            console.log(e);
          });

        }).catch((e) => {
          console.log(e);
        });
      }
    });


  });




//   for(i = 0 ; i < allDataString.length ; i++) {
//     var teacher = teacherString[i];
//
//     if(teacher['emailID'] == null){
//       teacher['emailID'] = "";
//     }
//     if(teacher['contactNumber'] == null){
//       teacher['contactNumber'] = "";
//     }
//
//     client.db(dbName).collection('Teacher').findOneAndUpdate({
//       employeeCode : teacher['employeeCode']
//     } , {
//       $set : {
//         name : teacher['name'] ,
//         employeeCode : parseInt(teacher['employeeCode']) ,
//         departmentCode : teacher['departmentCode'] ,
//         contactNumber : teacher['contactNumber'] ,
//         emailID : teacher['emailID'] ,
//         lectureGroups : [] ,
//         labGroups : [] ,
//         tutorialGroups : [] ,
//         tokens : []
//       }
//     } , {
//       upsert : true ,
//       returnOriginal : false
//     }).then((result) => {
//       console.log(result);
//     }).catch((e) => {
//       console.log(e);
//     });
//   }


//  client.close();
});
