const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase/app');
const compression = require('compression');
require('firebase/auth');
var flash = require('connect-flash');
app = express();
const requireLogin = require('./middlewares/requirelogin');
const admin = require('firebase-admin');
require('firebase/database');
var serviceAccount = require('./serviceAccountKey.json');

app.use(
  require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: 'This is streetlight',
  })
);
app.use(express.static('public'));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(compression());

var firebaseConfig = {
  apiKey: 'AIzaSyCzUSy8SElt8FMU7Bz59Mf2gj5sK5g-DcI',
  authDomain: 'guardian-angel-5259f.firebaseapp.com',
  databaseURL: 'https://guardian-angel-5259f.firebaseio.com',
  projectId: 'guardian-angel-5259f',
  storageBucket: 'guardian-angel-5259f.appspot.com',
  messagingSenderId: '839770846564',
  appId: '1:839770846564:web:b2c3d05267c30140f73671',
  measurementId: 'G-6MJS80Q9LV',
};
firebase.initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://guardian-angel-5259f.firebaseio.com',
});
firebase.auth.Auth.Persistence.LOCAL;

app.get('/signin', (req, res) => {
  res.render('signin');
});
app.post('/signin', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  var total = firebase.database().ref('Admin');

  total.once('value', (data) => {
    if (data.val()) {
      var zabhi = data.val();

      var teachers = Object.getOwnPropertyNames(data.val());
      teachers.forEach((teacher) => {
        if (
          zabhi[teacher].Email == email &&
          zabhi[teacher].Password == password
        ) {
          return firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
            
              res.redirect('/');
            })
            .catch((err) => res.redirect('/signin'));
        }
        // res.redirect('/signin');
      });
    }
  });
});

app.get('/logout', (req, res) => {
  firebase.auth().signOut();
  res.render('signin');
});

app.get('/mapuser', (req, res) => {
  var current_user = firebase.auth().currentUser;
  if (current_user != null) {
    var admin = firebase.database().ref('User');
    admin.once('value', (data) => {
      if (data.val()) {
        var users = Object.getOwnPropertyNames(data.val());
        res.render('mapsuser', {
          users: users,
          data: data.val(),
          user: current_user.displayName,
        });
      } else {
        res.send('i m here');
      }
    });
  }
});

// app.get('/mapuser2', (req, res) => {
//   var admin = firebase.database().ref('Near/users');
//   const prodId = '7UIcGVbjpOgh0erIWgFTALTumjh1';
//   admin.once('value', (data) => {
//     if (data.val()) {
//       var pol = data.val();
//       var users = Object.getOwnPropertyNames(data.val());
//       users.forEach((use) => {
//         if (prodId == use) {
//           console.log(pol['7UIcGVbjpOgh0erIWgFTALTumjh1']['Coming']);
//           var qw = Object.getOwnPropertyNames(
//             pol['7UIcGVbjpOgh0erIWgFTALTumjh1']['Coming']
//           );
//           console.log(qw[0]);
//         }
//       });
//       res.send('i m');
//     }
//   });
// });

// app.get('/maps/:eachAdmin', (req, res) => {
//   // var current_user = firebase.auth().currentUser;
//   // if (current_user != null) {
//   const prodId = req.params.eachAdmin;
//   var abhinav = [];
//   var qw = [];
//   var qw2 = [];
//   var total = firebase.database().ref('User');

//   total.once('value', (data) => {
//     if (data.val()) {
//       var teachers = Object.getOwnPropertyNames(data.val());
//       var abhi = data.val();
//       teachers.forEach((teacher) => {
//         if (
//           prodId == teacher
//         ) {
//           var total = firebase.database().ref('User');
//           var second = firebase.database().ref('Location/users');
//           var third = firebase.database().ref('Near/users');
          


//           third.once('value', (data) => {
//             if (data.val()) {
//               var new_value = data.val();
//               var usq = Object.getOwnPropertyNames(data.val());
//               usq.forEach((useq) => {
//                 if (prodId == useq) {
//                    qw.push(Object.getOwnPropertyNames(
//                     new_value[prodId]['Coming']));

//                     second.once('value',(data)=> {
//                       var zabhi =  Object.getOwnPropertyNames(data.val());
//                         var pol = data.val();
//                       zabhi.forEach((za)=> {
//                         if(prodId == za){
        
//                                     res.render('maps',{
//                                     teacher: prodId,
//                                     data: abhi,
//                                     helper:pol[qw[0]],
//                                     length:qw[0].length,
//                                     lat: pol[prodId]['Latitude'],
//                                     lng:pol[prodId]['Longitude'],
//                                     // user: current_user.displayName,
//                                     user:'abhi'
                                  

//                                   })
//                         }
//                       })
//                     })
//                 }
//               });
//             }
//           });

          

//         }
//       });
//     }
//   });
// // }
// });

app.get('/maps/:eachAdmin', (req, res) => {
  var current_user = firebase.auth().currentUser;
  if (current_user != null) {
  const prodId = req.params.eachAdmin;
  var abhinav = [];
  var total = firebase.database().ref('User');

  total.once('value', (data) => {
    if (data.val()) {
      var teachers = Object.getOwnPropertyNames(data.val());
      var abhi = data.val();
      teachers.forEach((teacher) => {
        if (
          prodId == teacher
        ) {
          var total = firebase.database().ref('User');
          var second = firebase.database().ref('Location/users');
          var third = firebase.database().ref('Near');
          second.once('value',(data)=> {
            var zabhi =  Object.getOwnPropertyNames(data.val());
            var pol = data.val();

            zabhi.forEach((za)=> {
              if(prodId == za){

                          res.render('maps',{
                          teacher: prodId,
                          data: abhi,
                          lat: pol[prodId]['Latitude'],
                          lng:pol[prodId]['Longitude'],
                          user: current_user.displayName,
                        })
              }
            })
          })

        }
      });
    }
  });
}
});

app.get('/', requireLogin, (req, res) => {
  var current_user = firebase.auth().currentUser;
  if (current_user != null) {
    var total = firebase.database().ref('Total');
    total.once('value', (data) => {
      if (data.val()) {
        res.render('dashboard', {
          data1: data.val(),
          user: current_user.displayName,
        });
      } else {
        res.render('dashboard', {
          user: current_user.displayName,
        });
      }
    });
  }
});

app.get('/members', requireLogin, (req, res) => {
  var current_user = firebase.auth().currentUser;
  if (current_user != null) {
    var admin = firebase.storageRef.child('users/');
    console.log(admin);
    admin.once('value', (data) => {
      if (data.val()) {
        var teachers = Object.getOwnPropertyNames(data.val());

        res.render('members', {
          teacherNames: teachers,
          data: data.val(),
          user: current_user.displayName,
        });
      } else {
        res.send('i m here');
      }
    });
  }
});

app.get('/staff', (req, res) => {
  var current_user = firebase.auth().currentUser;
  if (current_user != null) {
    var admin = firebase.database().ref('Admin');
    admin.once('value', (data) => {
      if (data.val()) {
        var names = Object.getOwnPropertyNames(data.val());
        res.render('staff', {
          adminNames: names,
          data: data.val(),
          user: current_user.displayName,
        });
      } else {
        res.send('i m here');
      }
    });
  }
});

app.post('/staff', async (req, res) => {
  var email = req.body.email;
  var password = req.body.Password;
  var fname = req.body.fname;
  var sname = req.body.sname;
  var dept = req.body.dept;
  var auth = req.body.auth;

  var root = firebase.database().ref().child(auth);

  var mailval = email.toString();
  var n = mailval.indexOf('@');
  var root2 = root.child(email.substring(0, n));
  var userData = {
    Name: fname + ' ' + sname,
    Email: email,
    Password: password,
    Department: dept,
  };
  root2.set(userData);

  admin
    .auth()
    .createUser({
      email: email,
      password: password,
      displayName: fname + ' ' + sname,
    })
    .then((userRecord) => {
      userRecord.displayName = fname + ' ' + sname;
      console.log('Successfully created new user:', userRecord);
    });
  res.redirect('/staff');
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started at port ${port}`));
