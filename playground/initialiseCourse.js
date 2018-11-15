const fs = require('fs');
var XLSX = require('xlsx');
var workbook = XLSX.readFile('./playground/UCS742 course.xlsx');
var sheet_name_list = workbook.SheetNames;
fs.writeFileSync('./playground/courses.json' , JSON.stringify(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]) , undefined , 2) );


const {MongoClient , ObjectID} = require('mongodb');

const dbName = 'thaparOne';

MongoClient.connect('mongodb://localhost:27017' , (err , client) => {
  if( err ){
    return console.log('Unable to connect to ModngoDB server');
  }
  console.log('Connected to MongoDB server');


  var courseString = fs.readFileSync('./playground/courses.json');
  courseString = JSON.parse(courseString);

  for(i = 0 ; i < courseString.length ; i++) {
        var course = courseString[i];
        var Lec = false;
        var Tut = false;
        var Lab = false;
        var alreadyPresent = false;
        if(course['LTP'] === "L"){
          Lec = true;

          client.db(dbName).collection('courses').findOneAndUpdate({
            courseCode : course['courseCode']
          } , {
            $set : {
              courseCode : course['courseCode'] ,
              courseName : course['courseName'] ,
              subjectType : course['subjectType'] ,
              subjectID : parseInt(course['subjectID']) ,
              lecture : true
            }
          } , {
            upsert : true ,
            returnOriginal : false
          }).then((result) => {
            console.log(result);
            alreadyPresent = true;
          }).catch((e) => {
            console.log(e);
            alreadyPresent = true;
          });

        }else if(course['LTP'] === 'P'){
          Lab = true;

          client.db(dbName).collection('courses').findOneAndUpdate({
            courseCode : course['courseCode']
          } , {
            $set : {
              courseCode : course['courseCode'] ,
              courseName : course['courseName'] ,
              subjectType : course['subjectType'] ,
              subjectID : parseInt(course['subjectID']) ,
              lab : true
            }
          } , {
            upsert : true ,
            returnOriginal : false
          }).then((result) => {
            console.log(result);
            alreadyPresent = true;
          }).catch((e) => {
            console.log(e);
            alreadyPresent = true;
          });
        }else if(course['LTP'] === 'T'){
          Tut = true;
          client.db(dbName).collection('courses').findOneAndUpdate({
            courseCode : course['courseCode']
          } , {
            $set : {
              courseCode : course['courseCode'] ,
              courseName : course['courseName'] ,
              subjectType : course['subjectType'] ,
              subjectID : parseInt(course['subjectID']) ,
              tutorial : true
            }
          } , {
            upsert : true ,
            returnOriginal : false
          }).then((result) => {
            console.log(result);
            alreadyPresent = true;
          }).catch((e) => {
            alreadyPresent = true;
            console.log(e);
          });
        }

        // if(alreadyPresent){
        //   continue;
        // }

        // const col = client.db(dbName).collection('Course').insertOne({
        //   courseCode : course['courseCode'] ,
        //   courseName : course['courseName'] ,
        //   subjectType : course['subjectType'] ,
        //   subjectID : parseInt(course['subjectID']) ,
        //   lecture : Lec ,
        //   tutorial : Tut ,
        //   lab : Lab ,
        // } , (err , result) => {
        //   if(err){
        //     return console.log('Unable to insert Course',err);
        //   }
        //   console.log(JSON.stringify(result.ops , undefined , 2));
        // });
    }
  client.close();
});
