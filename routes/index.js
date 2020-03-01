const express = require('express');
const router = express.Router();
const games = require("../models/game");
const ensureLogin = require('connect-ensure-login');



/* GET home page */
router.get('/main', ensureLogin.ensureLoggedIn(), (req, res, next) => {

  let userId = req.user._id;
  console.log(userId)
  games.findOne({
      "users.userID": userId
    }, {}, {
      sort: {
        'created_at': -1
      }
    })
    .then(game => {
      if (game !== null) {
        let bets = game.users.find(e => {
          return e.userID.toString() === req.user._id.toString()
        }).bets;
        // games.findOne({
        //     "users.userID": userId
        //   })
        //   .then((game => {
        let matches = game.matches;
        let round = game.round;
        let startRound = game.startRound;
        let endRound = game.endRound;
        console.log(endRound + " end round")

        games.findOne({}, {}, {
            sort: {
              'created_at': -1
            },
            skip: 1
          })
          .then(game2 => {

            let bets2 = game2.users.find(e => {
              return e.userID.toString() === req.user._id.toString()
            });
            console.log(game2)
            let matches2 = game2.matches;
            let round2 = game2.round;
            let startRound2 = game2.startRound;
            let endRound2 = game2.endRound;
            res.render('bet', {
              user: req.user,
              round,
              matches,
              bets,
              startRound,
              endRound,
              matches2,
              round2,
              startRound2,
              endRound2,
              bets2: bets2 ? bets2.bets : []

            })
          })
        // }))

      } else {
        res.redirect("/");
      }
    })

});



router.get('/', (req, res, next) => {

  if (req.user) {
    games.findOne({}, {}, {
        sort: {
          'created_at': -1
        }
      })
      .then(game => {
        if (!game.users.find(e => {
            return e.userID.toString() === req.user._id.toString()
          })) {
          let matches = game.matches;
          let round = game.round;
          let startRound = game.startRound;
          let endRound = game.endRound;

          games.findOne({}, {}, {
              sort: {
                'created_at': -1
              },
              skip: 1
            })
            .then(game2 => {

              let bets2 = game2.users.find(e => {
                return e.userID.toString() === req.user._id.toString()
              });

              let matches2 = game2.matches;
              let round2 = game2.round;
              let startRound2 = game2.startRound;
              let endRound2 = game2.endRound;
              res.render('index', {
                user: req.user,
                matches,
                round,
                startRound,
                endRound,
                matches2,
                round2,
                startRound2,
                endRound2,
                bets2: bets2 ? bets2.bets : []
              })
            })

        } else {
          res.redirect("/main");
        }
      })


  } else {
    games.findOne({}, {}, {
        sort: {
          'created_at': -1
        }
      })
      .then(game => {

        let matches = game.matches;
        let round = game.round;
        console.log(matches, round)
        return res.render('index', {
          matches,
          round
        });
      })
  }

});

// Send info to create new game/bets
router.post('/', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  let userId = req.user._id

  console.log(req.body)

  const {
    round,
    bet_0,
    bet_1,
    bet_2,
    bet_3,
    bet_4,
    bet_5,
    bet_6,
    bet_7,
    bet_8,
    bet_9,
    results,
  } = req.body;

  const newUser = {
    userID: userId,
    betScore: null,
    bets: [
      bet_0,
      bet_1,
      bet_2,
      bet_3,
      bet_4,
      bet_5,
      bet_6,
      bet_7,
      bet_8,
      bet_9
    ]

  }

  games.findOne({}, {}, {
      sort: {
        'created_at': -1
      }
    })
    .then(game => {
      if (game !== null) {
        if (!game.users.find(e => {
            return e.userID.toString() === req.user._id.toString()
          })) {
          games.update({
            _id: game._id
          }, {
            $push: {
              users: newUser
            }

          }).then(() => {
            let bets = newUser.bets
            res.redirect("/main")
          })
        }
      }
    });
});

router.post('/delete', ensureLogin.ensureLoggedIn(), (req, res, next) => {


  games.findOne({}, {}, {
      sort: {
        'created_at': -1
      }
    })
    .then(game => {
      if (game !== null) {
        if (game.users.find(e => {
            return e.userID.toString() === req.user._id.toString()
          })) {
          games.update({
            _id: game._id
          }, {
            $pull: {
              users: game.users.find(e => {
                return e.userID.toString() === req.user._id.toString()
              })
            }

          }).then(() => {

            res.redirect("/")
          })
        }
      }
    });

})



module.exports = router