const express = require('express');
const router = express.Router();
const games = require("../models/game");
const ensureLogin = require('connect-ensure-login');

/* GET home page */
router.get('/main', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  
    let userId = req.user._id;
    games.findOne({"users.userID": userId})
    .then(game => {
      if (game !== null) {
        let bets = game.users.find(e => {
          return e.userID.toString() === req.user._id.toString()
        }).bets;
        
        games.findOne({"users.userID": userId}, "-_id matches")
        .then(({matches}) => {
          
          res.render('bet', {
            user: req.user,
            matches,
            bets
          });
        })
        
      } else {
        res.render('index', {
          user: req.user
        });
      }
    })

});

router.get('/', (req, res, next) => {
  
      res.render('index', {
        user: req.user
      });
    
});



// Send info to create new game/bets
router.post('/', (req, res, next) => {
  let userId = req.user._id

  console.log(req.body)

  const {
    round,
    match1,
    match2,
    match3,
    match4,
    match5,
    match6,
    match7,
    match8,
    match9,
    match10,
    bet_1,
    bet_2,
    bet_3,
    bet_4,
    bet_5,
    bet_6,
    bet_7,
    bet_8,
    bet_9,
    bet_10,
    results,
  } = req.body;

  const newUser = {
    userID: userId,
    bets: [
      bet_1,
      bet_2,
      bet_3,
      bet_4,
      bet_5,
      bet_6,
      bet_7,
      bet_8,
      bet_9,
      bet_10
    ],
  }

  const matches = [
    match1,
    match2,
    match3,
    match4,
    match5,
    match6,
    match7,
    match8,
    match9,
    match10
  ]

  games.findOne({
      'round': req.body.round
    })
    .then(game => {
      console.log(req.body.round)
      
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
        } else {
         
          
          console.log(bets + " hola")
          return res.redirect("/main")
        }
      } else {
        const newGame = new games({
          round,
          matches,
          results,
          users: [newUser]
        })
        newGame.save()
          .then((games) => {
            res.redirect('/');
          })
          .catch((error) => {
            console.log('Error while creating new game');
            res.render("/");
          })
      }

    })
  // .catch(error => {
  //   console.log('Error trying to edit the movie: ', error);
  // })
})

router.get("/edit", (req, res, next) => {
  res.render("edit")
})


module.exports = router;