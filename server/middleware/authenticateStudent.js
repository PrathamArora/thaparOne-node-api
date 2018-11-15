var {Student} = require('./../models/student.js');

var authenticateStudent = (req , res , next) => {
  var token = req.header('x-auth');

  Student.findByToken(token).then( (student) => {
    if(! student){
      return Promise.reject({'error' : 'Unable to find Student'});
    }

//    console.log(JSON.stringify(teacher , undefined , 2));
    // req.user = user;
    // req.user.email = user.email;
    // req.user.id = user._id;
    // req.token = token;
    req.student = student;

    next();
  }).catch((error) =>{
    res.status(401).send(error);
  });

};


module.exports = {
  authenticateStudent : authenticateStudent
}
