// xlsxj = require("xlsx-to-json");
//
// xlsxj({
//     input: "./playground/3CO12 students.xlsx",
//     output: "./playground/students.json"
// }, function(err, result) {
//   if(err) {
//     console.error(err);
//   }else {
//     console.log(result);
//   }
// });
//

const fs = require('fs');
var XLSX = require('xlsx');
var workbook = XLSX.readFile('./playground/3CO12 students.xlsx');
var sheet_name_list = workbook.SheetNames;
fs.writeFileSync('./playground/students.json' , JSON.stringify(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]) , undefined , 2) );

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/thaparOne');
//
// //const {mongoose , db} = require('./../server/db/mongoose.js');
// var {Student} = require('./../server/models/student.js');
//
//
// var studentsString = fs.readFileSync('./playground/students.json');
// studentsString = JSON.parse(studentsString);
//
// for(var i = 0 ; i < studentsString.length ; i++){
//   var student = studentsString[i];
//
//   var studentObj = new Student({
//     name : student['name'] ,
//     rollNumber : parseInt(student['rollNumber']) ,
//     studentContactNumber : student['studentContactNumber'] ,
//     parentContactNumber : student['parentContactNumber'] ,
//     branchCode : student['branchCode'] ,
//     programCode : student['programCode'] ,
//     studentEmailID : student['studentEmailID'] ,
//     parentEmailID : student['parentEmailID'] ,
//     currSub : [] ,
//     prevSub : [] ,
//     tokens : []
//   });
//
//   studentObj.save().then((studentSaved) => {
//     console.log(studentSaved);
//   }).catch((e) => {
//     console.log(e);
//   });
// }


const {MongoClient , ObjectID} = require('mongodb');

const dbName = 'thaparOne';

MongoClient.connect('mongodb://localhost:27017' , (err , client) => {
  if( err ){
    return console.log('Unable to connect to ModngoDB server');
  }
  console.log('Connected to MongoDB server');


  var studentsString = fs.readFileSync('./playground/students.json');
  studentsString = JSON.parse(studentsString);

  for(i = 0 ; i < studentsString.length ; i++){
        var student = studentsString[i];
        const col = client.db(dbName).collection('students').insertOne({
          name : student['name'] ,
          rollNumber : parseInt(student['rollNumber']) ,
          studentContactNumber : student['studentContactNumber'] ,
          parentContactNumber : student['parentContactNumber'] ,
          branchCode : student['branchCode'] ,
          programCode : student['programCode'] ,
          studentEmailID : student['studentEmailID'] ,
          parentEmailID : student['parentEmailID'] ,
          currSub : [] ,
          prevSub : [] ,
          tokens : []
        } , (err , result) => {
          if(err){
                return console.log('Unable to insert Student',err);
          }
          console.log(JSON.stringify(result.ops , undefined , 2));
        });
    }
  client.close();
});

// ------------------------------------------------------------------------------------------------








// ------------------------------------------------------------------------------------------------

  /*
  [
    {"parentEmailID":"Jashansadioura@gmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401553002","name":"JASHANPREET SINGH SADIOURA","studentContactNumber":"9780840002","studentEmailID":"Jashansadioura@gmail.com","parentContactNumber":"9780840002"},
    {"parentEmailID":"sabrinakheterpal@yahoo.in","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503027","name":"SHREY KUMAR" , "studentContactNumber":"9717622234","studentEmailID":"kumar.shrey97@yahoo.com","parentContactNumber":"9034611007"},
    {"parentEmailID":"shauryapsingh96@gmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503026","name":"SHAURYA PRATAP SINGH","studentContactNumber":"9781893035","studentEmailID":"sasukeair01@gmail.com","parentContactNumber":"9407303035"},
    {"parentEmailID":"vijaynishu96@yahoo.co.in","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503020","name":"PRATHAM ARORA","studentContactNumber":"9654612021","studentEmailID":"arorapratham6@gmail.com","parentContactNumber":"9891853337"},
    {"parentEmailID":"kunalkk477@gmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503014","name":"KUNAL KISHORE","studentContactNumber":"8195905598","studentEmailID":"kunal.kishore57@gmail.com","parentContactNumber":"9835411662"},
    {"parentEmailID":"sng80600@gmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503013","name":"KESHAV GARG","studentContactNumber":"9811967439","studentEmailID":"keshavgarg139@gmail.com","parentContactNumber":"9999616653"},
    {"parentEmailID":"deepakgarg003@rediffmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503009","name":"CHINMAYA GARG","studentContactNumber":"8195910120","studentEmailID":"chinmaya.garg1997@gmail.com","parentContactNumber":"9314500095"},
    {"parentEmailID":"technofac@yahoo.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503022","name":"RISHABH BUDHOULIYA","studentContactNumber":"9717332554","studentEmailID":"rishabh.noida@gmail.com","parentContactNumber":"9212022857"},
    {"parentEmailID":"prashantmishra863@gmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503019","name":"PRASHANT MISHRA","studentContactNumber":"9455297667","studentEmailID":"prashantmishra863@gmail.com","parentContactNumber":"9935745516"},
    {"parentEmailID":"sodhivirmala@gmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503008","name":"BRAHMRITA SINGH","studentContactNumber":"9790035022","studentEmailID":"brahmrita@gmail.com","parentContactNumber":"9530923649"},
    {"parentEmailID":"NBANSAL@JBM.CO.IN","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503007","name":"ARPIT BANSAL","studentContactNumber":"9888919548","studentEmailID":"arpit.bansal2010@gmail.com","parentContactNumber":"9899003035"},
    {"parentEmailID":"pkaurblling@gmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503016","name":"PARNEET KAUR","studentContactNumber":"9888694429","studentEmailID":"pkaurbilling@gmail.com","parentContactNumber":"8528644275"},
    {"parentEmailID":"sanjays077@gmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503015","name":"KUSHAGRA SHARMA","studentContactNumber":"9760974941","studentEmailID":"kushagrasharma48@gmail.com","parentContactNumber":"9897205301"},
    {"parentEmailID":"ashokgargsbi@gmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503028","name":"SHUBHAM GARG","studentContactNumber":"8195910132","studentEmailID":"shubhamgarg24@gmail.com","parentContactNumber":"8410655604"},
    {"parentEmailID":"sophie.kakker@gmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503029","name":"SOPHIE KAKKER","studentContactNumber":"8168617743","studentEmailID":"sophie.kakker@gmail.com","parentContactNumber":"9466265761"},
    {"parentEmailID":"smahajan68@gmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503017","name":"PRANJAL MAHAJAN","studentContactNumber":"7508489874","studentEmailID":"pranjalmahajan96@gmail.com","parentContactNumber":"9815034233"},
    {"parentEmailID":"kmsharma69@gmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503023","name":"ROHAN SHARMA","studentContactNumber":"9968384185","studentEmailID":"rohansharma1996@gmail.com","parentContactNumber":"9868387810"},
    {"parentEmailID":"sanjiwankumar@gmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503006","name":"AMAN KUMAR","studentContactNumber":"9465001010","studentEmailID":"amankumar0343@gmail.com","parentContactNumber":"9417005555"},
    {"parentEmailID":"rajesh.sahdev66@gmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503025","name":"SAURAV VERMA","studentContactNumber":"8130836405","studentEmailID":"saurav.verma97@gmail.com","parentContactNumber":"9910034204"},
    {"parentEmailID":"ankeshjain@unionbankofindia.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503030","name":"VARUN JAIN","studentContactNumber":"8860084673","studentEmailID":"varunjain1997@gmail.com","parentContactNumber":"8800560528"},
    {"parentEmailID":"ashwaniisetia@gmail.com","programCode":"BEMBA","branchCode":"COE","rollNumber":"401503018","name":"PRANVI SETIA","studentContactNumber":"9990212126","studentEmailID":"pranvisetia@gmail.com","parentContactNumber":"9891042944"}
  ]


  */
