const express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  config = require('../config/database'), //get db config file
  User = require('../models/user'),
  port = process.env.PORT || 8080,
  jwt = require('jwt-simple'),
  app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


app.use(morgan('dev'));


app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send("hello");
});
mongoose.connect(config.database);
require('../config/passport')(passport);

var apiRoutes = express.Router();

apiRoutes.post('/signup', function(req, res) {
  if (!req.body.user_name || !req.body.password) {
    res.json({
      status: false,
      msg: "please pass name and password"
    })
  } else {
    var newUser = new User({
      user_name: req.body.user_name,
      password: req.body.password,
      phone_number: req.body.phone_number,
      company_name: req.body.company_name,
      requirement: req.body.requirement,
      email: req.body.email
    });

    newUser.save(function(err) {
      console.log(newUser);

      if (err) {
        console.log(res.json);
        res.json({
          status: false,
          msg: 'Username already exists'
        });
      } else {
        res.json({
          status: true,
          msg: 'Successful created user'
        });
        console.log(newUser);
      }
    });

  }
});



// apiRoutes.post('/authenticate', function(req, res) {
//   User.findOne({
//     name: req.body.name
//   }, function(err, user) {
//     if (err) throw err;
//     if (!user) {
//       return res.status(403).send({
//         succes: false,
//         msg: 'Authentication failed. user not found.'
//       });
//     } else {
//       user.comparePassword(req.body.password, function(err, isMatch) {
//         if (isMatch && !err) {
//           var token = jwt.encode(user, config.secret);
//           res.json({
//             succes: true,
//             token: 'JWT' + token
//           });
//         } else {
//           return res.status(403).send({
//             succes: false,
//             msg: 'Authentication failed. Wrong password'
//           });
//         }
//       });
//     }
//   });
// });



apiRoutes.post('/login', function(req, res) {


  User.findOne({
    user_name: req.body.user_name,
    password: req.body.password

  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.json({
        success: false,
        msg: 'Login failed. user not found.'
      });
    } else {
      res.json({
        success: true,
        msg: 'login succesfully',
        user_name: user.user_name,
        phone_number: user.phone_number,
        company_name: user.company_name,
        requirement: user.requirement,
        email: user.email

      });
    }
  });
});


app.use('/api', apiRoutes);



app.listen(port);
console.log("//http:localhost:" + port);
