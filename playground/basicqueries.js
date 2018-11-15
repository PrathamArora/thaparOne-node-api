const {MongoClient , ObjectID} = require('mongodb');

const dbName = 'thaparOne';

// var user = {name : 'Pratham' , age : 21};
// var {name} = user;
// console.log(name);


MongoClient.connect('mongodb://localhost:27017' , (err , client) => {
  if( err ){
    return console.log('Unable to connect to ModngoDB server');
  }
  console.log('Connected to MongoDB server');


//---------------------------Student Schema ---------------------------------
  // const col = client.db(dbName).collection('Students').insertOne({
  //   name : 'Pratham Arora',
  //   rollNumber : 401503020,
  //   group : 'COE12',
  //   yearOfBatch : 2015,
  //   contactNumber : '+919654612021',
  //   branch : 'BE-COE',
  //   photoURL : 'www.photoURL.com/401503020',
  //   emailID : 'parora_bemba15@thapar.edu',
  //   currSub : [{courseCode : 'UCS615' , teacherCode : 'AM'}],
  //   prevSub : [{courseCode : 'UCS614' , teacherCode : 'NT'}]
  // } , (err , result) => {
  //   if(err){
  //     return console.log('Unable to insert student',err);
  //   }
  //   console.log(JSON.stringify(result.ops , undefined , 2));
  // });

  //---------------------------Attendance Schema ---------------------------------
  // const col = client.db(dbName).collection('Attendance').insertOne({
  //   _studentid : new ObjectID('5ab78958f3509b5f788404bb'),
  //   courseCode : 'UCS615',
  //   lectureAttendance : [{date : new Date().getTime() , sessionid : new ObjectID()}],
  //   tutAttendance : [{date : new Date().getTime() , sessionid : new ObjectID()}] ,
  //   labAttendance : [{date : new Date().getTime() , sessionid : new ObjectID()}]
  // } , (err , result) => {
  //   if(err){
  //     return console.log('Unable to insert Attendance',err);
  //   }
  //   console.log(JSON.stringify(result.ops , undefined , 2));
  // });


  //---------------------------Teacher Schema ---------------------------------
  // const col = client.db(dbName).collection('Teacher').insertOne({
  //   name : 'Arzoo Miglani' ,
  //   contactNumber : '+919991081474' ,
  //   emailID : 'arzoomiglani@thapar.edu' ,
  //   teacherCode : 'AM' ,
  //   lectureGroups : [{
  //     batchYear : 3,
  //     currentYear : 2018 ,
  //     batches : [{batch : 'COE10'},{batch : 'COE11'},{batch : 'COE12'}] ,
  //   }] ,
  //   labGroups : [{
  //     batchYear : 3,
  //     currentYear : 2018 ,
  //     batches : [{batch : 'COE10'}] ,
  //   }] ,
  //   tutorialGroups : [{
  //     batchYear : 3,
  //     currentYear : 2018 ,
  //     batches : [{batch : 'COE12'}] ,
  //   }]
  // } , (err , result) => {
  //   if(err){
  //     return console.log('Unable to insert Teacher',err);
  //   }
  //   console.log(JSON.stringify(result.ops , undefined , 2));
  // });

// -------------------------- CourseSchema -----------------------------------
  // const col = client.db(dbName).collection('Course').insertOne({
  //   courseCode : 'UTA012' ,
  //   courseName : 'INNOVATION AND ENTREPRENEURSHIP' ,
  //   subjectType : 'C' ,
  //   subjectID : 160242 ,
  //   lecture : true ,
  //   tutorial : false ,
  //   lab : true ,
  // } , (err , result) => {
  //   if(err){
  //     return console.log('Unable to insert Course',err);
  //   }
  //   console.log(JSON.stringify(result.ops , undefined , 2));
  // });

// -------------------------StudentSchema -------------------------------------
// const col = client.db(dbName).collection('Student').insertOne({
//   name : 'RISHABH BUDHOULIYA' ,
//   rollNumber : 401503022 ,
//   studentContactNumber : '9654600000' ,
//   parentContactNumber : '999999999' ,
//   branchCode : 'COE' ,
//   programCode : 'BEMBA' ,
//   studentEmailID : 'rishabh@gmail.com' ,
//   parentEmailID : 'abc@gmail.com' ,
//   currSub : [] ,
//   prevSub : []
// } , (err , result) => {
//   if(err){
//     return console.log('Unable to insert Course',err);
//   }
//   console.log(JSON.stringify(result.ops , undefined , 2));
// });

// ------------------------ SubSectionSchema -----------------------------------
// const col = client.db(dbName).collection('SubSection').insertOne({
//   subsectionCode : '3CO12' ,
//   academicYear : 1516 ,
//   programCodes : [{
//     programCode : 'BEMBA'
//   }] ,
//   branchCodes : [{
//     branchCode : 'COE'
//   }] ,
//   examCode : '1718EVESEM' ,
//   _studentIDs : [{
//     _studentid : ObjectID('5abc046289be524568951d12')
//   } , {
//     _studentid : ObjectID('5abc048d6178c52c746f9941')
//   }]
// } , (err , result) => {
//   if(err){
//     return console.log('Unable to insert Course',err);
//   }
//   console.log(JSON.stringify(result.ops , undefined , 2));
// });

//------------------------- TeacherSchema -------------------------------------
// const col = client.db(dbName).collection('Teacher').insertOne({
//   name : 'AMIT KUMAR BHARDWAJ' ,
//   contactNumber : '8146988110' ,
//   employeeCode : 1000788 ,
//   departmentCode : 'DRB' ,
//   emailID : 'akbhardwaj@thapar.edu' ,
//   lectureGroups : [{
//     _courseID : ObjectID('5abc01c9262c114c38ee647e') ,
//     subsectionIDs : [{
//       _subsectionID : ObjectID('5abc06ca636bde340459c99e')
//     }]
//   }] ,
//   labGroups : [{
//     _courseID : ObjectID('5abc01c9262c114c38ee647e') ,
//     subsectionIDs : [{
//       _subsectionID : ObjectID('5abc06ca636bde340459c99e')
//     }]
//   }] ,
//   tutorialGroups : []
// } , (err , result) => {
//   if(err){
//     return console.log('Unable to insert Course',err);
//   }
//   console.log(JSON.stringify(result.ops , undefined , 2));
// });


//------------------------- AttendanceSchema ---------------------------------------
// const col = client.db(dbName).collection('Attendance').insertOne({
//   _teacherID : ObjectID('5abc08d41d9a343f4c397ed1') ,
//   _courseID : ObjectID('5abc01c9262c114c38ee647e') ,
//   date : new Date() ,
//   remarks : 'Taught the basics of ENTREPRENEURSHIP' ,
//   _subsectionIDs : [{
//     _subsectionID : ObjectID('5abc06ca636bde340459c99e')
//   }] ,
//   presentStudentIDs : [{
//     _studentID : ObjectID('5abc034dba67641628cb71f5')
//   } , {
//     _studentID : ObjectID('5abc046289be524568951d12')
//   }] ,
//   ltp : 'l'
// } , (err , result) => {
//   if(err){
//     return console.log('Unable to insert Course',err);
//   }
//   console.log(JSON.stringify(result.ops , undefined , 2));
// });


// ----------------------- Update Student Schema ---------------------------------
const col = client.db(dbName).collection('Student').findOneAndUpdate({
  _id : ObjectID('5abc046289be524568951d12')
} , {
  $push : {
    currSub : {
      _courseID : ObjectID('5abc01c9262c114c38ee647e') ,
      _teacherID : ObjectID('5abc08d41d9a343f4c397ed1') ,
      _subsectionID : ObjectID('5abc06ca636bde340459c99e') ,
      coreSubject : false ,
      totalClasses : 1 ,
      classesAttended : 1
    }
  }
} , {
  returnOriginal : false
}).then((result) => {
  console.log(result);
});













  client.close();
});
