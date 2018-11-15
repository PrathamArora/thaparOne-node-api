const fs = require('fs');
var XLSX = require('xlsx');
// var workbook = XLSX.readFile('./playground/data.xls');
// var sheet_name_list = workbook.SheetNames;
// fs.writeFileSync('./playground/excel.json' , JSON.stringify(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]) , undefined , 2) );

var courseString = fs.readFileSync('./playground/courses.json');
courseString = JSON.parse(courseString);

console.log(courseString[0]);

for(i = 0 ; i < courseString.length ; i++) {

}
