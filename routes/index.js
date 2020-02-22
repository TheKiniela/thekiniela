const express = require('express');
const router = express.Router();
const games = require("../models/game");

/* GET home page */
router.get('/', (req, res, next) => {
  
  res.render('index', {
    user: req.user
  });

});

router.get('/bet', (req, res, next) => {
  res.render('bet', {
    
  })

});

// Send info to create new game/bets
router.post('/', (req, res, next) => {
  let userId = req.user._id

  // function saveUsersBets(user) {
  //   console.log(user + " lo imprime. VIVA!!")

  // }
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
            
          }).then(() => res.redirect("bet", game._id))
        } else {
         
          let apuestas = newUser.bets
          console.log(apuestas + " hola")
          return res.render("bet", {apuestas})
        }
      } else {
        const newGame = new games({
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