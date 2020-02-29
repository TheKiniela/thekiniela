require('dotenv').config();

const connectMongo = require('connect-mongo');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const MongoStore = connectMongo(session);
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("./models/user");
const Game = require("./models/game");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
let CronJob = require('cron').CronJob;
const axios = require('axios').default;


mongoose
  // .connect('mongodb://localhost/kiniela-user', {useNewUrlParser: true})
  .connect('mongodb://localhost/kiniela', {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Kiniela';
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// passport
app.use(
  session({
    secret: 'our-passport-local-strategy-app',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      url: 'mongodb://localhost/kiniela'
    }),
  })
);

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

// Common login strategy
passport.use(
  new LocalStrategy((username, password, callback) => {
    User.findOne({
        username
      })
      .then(user => {
        if (!user) {
          return callback(null, false, {
            message: 'Incorrect username'
          });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return callback(null, false, {
            message: 'Incorrect password'
          });
        }
        callback(null, user);
      })
      .catch(error => {
        callback(error);
      });
  })
);

// Facebook strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: "190776328800282",
      clientSecret: "25688dbffb080ca09ab74cc23f97a965",
      callbackURL: "/auth/facebook/callback"
    },
    function (accessToken, refreshToken, profile, done) {
      // to see the structure of the data in received response:
      console.log("Facebook account details:", profile);

      User.findOne({
          facebookID: profile.id
        })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }

          User.create({
              facebookID: profile.id,
              username: profile.displayName,
              score: 0
            })
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => done(err)); // closes User.create()
        })
        .catch(err => done(err)); // closes User.findOne()
    }
  ));

app.use(passport.initialize());
app.use(passport.session());

const index = require('./routes/index');
app.use('/', index);

const router = require('./routes/auth-routes');
app.use('/', router);




module.exports = app;

// Google strategy
passport.use(
  new GoogleStrategy({
      clientID: "120553079671-0n6tbtaja4amggujhiaib6vl08ik2rkg.apps.googleusercontent.com",
      clientSecret: "FHja4bIsRcKINaV5YBOS7NOy",
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      // to see the structure of the data in received response:
      console.log("Google account details:", profile);

      User.findOne({
          googleID: profile.id
        })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }

          User.create({
              googleID: profile.id,
              username: profile.displayName,
              score: 0
            })
            .then(newUser => {
              done(null, newUser);
            })
            .catch(err => done(err)); // closes User.create()
        })
        .catch(err => done(err)); // closes User.findOne()
    }
  )
);




// Schedule game updates
let jobCreateGame = new CronJob('45 20 * * 5', function() {
  // Execute this every friday at 20,45h
  createGame();  
});
jobCreateGame.start();

// let jobCheckScores = new CronJob('59 23 * * 5-7', function() {
//   // Execute this every friday, saturday and sunday at 23,59h
//   checkScores();
// });
// jobCheckScores.start();




// Get start and end dates
Date.prototype.addDays = function(days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

let formatDate = (date) => {
  let day = date.getDate();
  day = day.toString().padStart(2,"0");

  let month = date.getMonth() + 1;
  month = month.toString().padStart(2,"0")

  let year = date.getFullYear();

  return `${year}-${month}-${day}`
}

let startDate = new Date();
let endDate = startDate.addDays(2);

startDate = formatDate(startDate)
endDate = formatDate(endDate)

startDate = "2020-03-06"
endDate = "2020-03-08"


// check scores
// let checkScores = () => {
//   const restApifootball = axios.create({
//     baseURL: `https://apiv2.apifootball.com/?action=get_events&from=${startDate}&to=${endDate}&country_id=135&league_id=468&APIkey=ce05d1110b0b6ea02a5649e270ed95c243e036dc31a6b0e3f89be14dbe27a160`
//   })
  
//   function getApifootball(restApifootball) {
//     return restApifootball
//       .get()
//       .then(responseFromAPI => responseFromAPI.data)
//       .catch(err => console.log("Error is: ", err));
//   }

//   getApifootball(restApifootball).then(data => {
//     if (!data.hasOwnProperty("error")) {
//       let round = data[0].match_round;
//       let matches = data.map(match => {
//         let homeTeam = match.match_hometeam_name;
//         let awayTeam = match.match_awayteam_name;
//         return `${homeTeam} - ${awayTeam}`
//       })
     
//       let results = [];
//       let users = []

//       const newGame = new Game( {
//         round,
//         matches,
//         results,
//         users
//       } )
//       newGame.save()
//           .then((game) => {
//             console.log("Juego creado: " + game)
//           })
//           .catch((game) => {
//             console.log('Error while creating new game', game);
//           })
      
//     } 

   
//   });
  
// }




// create game
let createGame = () => {
  const restApifootball = axios.create({
    baseURL: `https://apiv2.apifootball.com/?action=get_events&from=${startDate}&to=${endDate}&country_id=135&league_id=468&APIkey=ce05d1110b0b6ea02a5649e270ed95c243e036dc31a6b0e3f89be14dbe27a160`
  })
  
  function getApifootball(restApifootball) {
    return restApifootball
      .get()
      .then(responseFromAPI => responseFromAPI.data)
      .catch(err => console.log("Error is: ", err));
  }

  getApifootball(restApifootball).then(data => {
    if (!data.hasOwnProperty("error")) {
      let round = data[0].match_round;
      let matches = data.map(match => {
        let homeTeam = match.match_hometeam_name;
        let awayTeam = match.match_awayteam_name;
        return `${homeTeam} - ${awayTeam}`
      })
     
      let results = [];
      let users = []


      const newGame = new Game( {
        round,
        matches,
        results,
        users,
        startRound: startDate,
        endRound: endDate
      } )
      newGame.save()
          .then((game) => {
            console.log("Juego creado: " + game)
          })
          .catch((game) => {
            console.log('Error while creating new game', game);
          })
      
    } 

   
  });
  
}

// createGame();