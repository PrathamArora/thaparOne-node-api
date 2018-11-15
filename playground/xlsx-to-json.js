xlsxj = require("xlsx-to-json");
xlsxj({
    input: "C:/Node.js/thaparOne-node-api/playground/3CO12 students.xlsx",
    output: "C:/Node.js/thaparOne-node-api/playground/output.json"
}, function(err, result) {
  if(err) {
    console.error(err);
  }else {
    console.log(result);
  }
});
