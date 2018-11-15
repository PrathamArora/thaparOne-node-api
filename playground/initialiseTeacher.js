const fs = require('fs');
var XLSX = require('xlsx');
var workbook = XLSX.readFile('./playground/UCS742 teacher.xlsx');
var sheet_name_list = workbook.SheetNames;
fs.writeFileSync('./playground/teachers.json' , JSON.stringify(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]) , undefined , 2) );


const {MongoClient , ObjectID} = require('mongodb');

const dbName = 'thaparOne';

MongoClient.connect('mongodb://localhost:27017' , (err , client) => {
  if( err ){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');


  var teacherString = fs.readFileSync('./playground/teachers.json');
  teacherString = JSON.parse(teacherString);

  for(i = 0 ; i < teacherString.length ; i++) {
    var teacher = teacherString[i];

    if(teacher['emailID'] == null){
      teacher['emailID'] = "";
    }
    if(teacher['contactNumber'] == null){
      teacher['contactNumber'] = "";
    }

    client.db(dbName).collection('teachers').findOneAndUpdate({
      employeeCode : teacher['employeeCode']
    } , {
      $set : {
        name : teacher['name'] ,
        employeeCode : parseInt(teacher['employeeCode']) ,
        departmentCode : teacher['departmentCode'] ,
        contactNumber : teacher['contactNumber'] ,
        emailID : teacher['emailID'] ,
        lectureGroups : [] ,
        labGroups : [] ,
        tutorialGroups : [] ,
        tokens : []
      }
    } , {
      upsert : true ,
      returnOriginal : false
    }).then((result) => {
      console.log(result);
    }).catch((e) => {
      console.log(e);
    });
  }
  client.close();
});
