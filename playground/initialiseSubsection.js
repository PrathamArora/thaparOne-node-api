const fs = require('fs');
var XLSX = require('xlsx');
var workbook = XLSX.readFile('./playground/3CO12 subsection.xlsx');
var sheet_name_list = workbook.SheetNames;
fs.writeFileSync('./playground/subsections.json' , JSON.stringify(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]) , undefined , 2) );


const {MongoClient , ObjectID} = require('mongodb');

const dbName = 'thaparOne';

MongoClient.connect('mongodb://localhost:27017' , (err , client) => {
  if( err ){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');


  var subsectionString = fs.readFileSync('./playground/subsections.json');
  subsectionString = JSON.parse(subsectionString);

var i = 0;

subsectionString.forEach(function(subsection){
  console.log(subsection);
  var subjectID = parseInt(subsection['subjectID']);

  var course = client.db(dbName).collection('courses').findOne({
    subjectID : subjectID
  }).then((doc) => {
    var programCode = [{programCode : subsection['programCode']}];
    var branchCode = [{branchCode : subsection['branchCode']}];
    console.log(JSON.stringify(doc , undefined , 2));
    if(doc['subjectType'] == 'C'){
      var courseCore = {_courseID : doc['_id']};

      client.db(dbName).collection('subsectioncores').findOneAndUpdate({
        subsectionCode : subsection['subsectionCode']
        } , {
        $set : {
            subsectionCode : subsection['subsectionCode'] ,
            academicYear : parseInt(subsection['academicYear']) ,
            examCode : subsection['examCode'] ,
            programCodes : programCode ,
            branchCodes : branchCode ,
            // _courseIDs : [] ,
            _studentIDs : []
        } ,
        $push : {
          _courseIDs : courseCore
        }
      } , {
        upsert : true ,
        returnOriginal : false
      }).then((result) => {
        console.log(result);
        i = i + 1;
        if(i == subsectionString.length){
          client.close();
        }
      }).catch((e) =>{
        console.log(e);
      });


      // var col = client.db(dbName).collection('subsectioncores').insertOne({
      //   subsectionCode : subsection['subsectionCode'] ,
      //   academicYear : parseInt(subsection['academicYear']) ,
      //   examCode : subsection['examCode'] ,
      //   programCodes : programCode ,
      //   branchCodes : branchCode ,
      //   _courseIDs : courseCore ,
      //   _studentIDs : []
      // } , (err , result) => {
      //   if(err){
      //     return console.log('Unable to insert Subsection',err);
      //   }
      //     console.log(JSON.stringify(result.ops , undefined , 2));
      // });
    } else if(doc['subjectType'] == 'E'){

      client.db(dbName).collection('subsectionelectives').findOneAndUpdate({
        subsectionCode : subsection['subsectionCode'] ,
        _courseID : doc['_id']
      } , {
        $set : {
//            _courseID : ObjectID(doc['_id']) ,
            subsectionCode : subsection['subsectionCode'] ,
            academicYear : parseInt(subsection['academicYear']) ,
            examCode : subsection['examCode'] ,
            programCodes : programCode ,
            branchCodes : branchCode ,
            _studentIDs : []
        }
      } , {
        upsert : true ,
        returnOriginal : false
      }).then((result) => {
        console.log(result);
        i = i + 1;
        if(i == subsectionString.length){
          client.close();
        }
      }).catch((e) =>{
        console.log(e);
      });

      // client.db(dbName).collection('SubSectionElective').insertOne({
      //   subsectionCode : subsection['subsectionCode'] ,
      //   academicYear : parseInt(subsection['academicYear']) ,
      //   examCode : subsection['examCode'] ,
      //   programCodes : programCode ,
      //   branchCodes : branchCode ,
      //   _courseID : ObjectID(doc['_id']) ,
      //   _studentIDs : []
      // } , (err , result) => {
      //   if(err){
      //     return console.log('Unable to insert Subsection',err);
      //   }
      //     console.log(JSON.stringify(result.ops , undefined , 2));
      // });
    }
  } , (e) => {
    return undefined;
  });

});

/*
  for(i = 0 ; i < subsectionString.length ; i++){
    var subsection = subsectionString[i];
    console.log(subsection);
    var subjectID = parseInt(subsection['subjectID']);

    var course = client.db(dbName).collection('Course').findOne({
      subjectID : subjectID
    }).then((doc) => {
      var programCode = [{programCode : subsection['programCode']}];
      var branchCode = [{branchCode : subsection['branchCode']}];

      if(doc['subjectType'] == 'C'){
        var courseCore = [{_courseID : ObjectID(doc['_id'])}];

        var col = client.db(dbName).collection('subsectioncores').insertOne({
          subsectionCode : subsection['subsectionCode'] ,
          academicYear : parseInt(subsection['academicYear']) ,
          examCode : subsection['examCode'] ,
          programCodes : programCode ,
          branchCodes : branchCode ,
          _courseIDs : courseCore ,
          _studentIDs : []
        } , (err , result) => {
          if(err){
            return console.log('Unable to insert Subsection',err);
          }
            console.log(JSON.stringify(result.ops , undefined , 2));
        });
      } else if(doc['subjectType'] == 'E'){
        client.db(dbName).collection('SubSectionElective').insertOne({
          subsectionCode : subsection['subsectionCode'] ,
          academicYear : parseInt(subsection['academicYear']) ,
          examCode : subsection['examCode'] ,
          programCodes : programCode ,
          branchCodes : branchCode ,
          _courseID : ObjectID(doc['_id']) ,
          _studentIDs : []
        } , (err , result) => {
          if(err){
            return console.log('Unable to insert Subsection',err);
          }
            console.log(JSON.stringify(result.ops , undefined , 2));
        });
      }
    } , (e) => {
      return undefined;
    });

    // course.then((doc) => {
    //   subjedoc = doc;
    //   console.log(doc);
    // } , (e) => {
    //   console.log(e);
    // });
    // console.log("subjectdoc : " , course );

    // if(subjectdoc['subjectType'] === 'C'){
    //   var col = client.db(dbName).collection('subsectioncores').insertOne({
    //     subsectionCode : subsection['subsectionCode'] ,
    //     academicYear : parseInt(subsection['academicYear']) ,
    //     examCode : subsection['examCode'] ,
    //     // 'programCodes.programCode' : subsection['programCode'] ,
    //     // 'branchCodes.branchCode' : subsection['branchCode'] ,
    //     // '_courseIDs._courseID' : ObjectID(doc['_id']) ,
    //     _studentIDs : []
    //   } , (err , result) => {
    //     if(err){
    //       return console.log('Unable to insert Subsection',err);
    //     }
    //       console.log(JSON.stringify(result.ops , undefined , 2));
    //   });
    // }else{
    //   client.db(dbName).collection('SubSectionElective').insertOne({
    //     subsectionCode : subsection['subsectionCode'] ,
    //     academicYear : parseInt(subsection['academicYear']) ,
    //     examCode : subsection['examCode'] ,
    //     // 'programCodes.programCode' : subsection['programCode'] ,
    //     // 'branchCodes.branchCode' : subsection['branchCode'] ,
    //     _courseID : ObjectID(doc['_id']) ,
    //     _studentIDs : []
    //   } , (err , result) => {
    //     if(err){
    //       return console.log('Unable to insert Subsection',err);
    //     }
    //       console.log(JSON.stringify(result.ops , undefined , 2));
    //   });
    // }
    //
    //


  } */
//  client.close();
});
