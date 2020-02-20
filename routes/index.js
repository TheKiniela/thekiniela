const express = require('express');
const router  = express.Router();
const games = require("../models/game");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {user: req.user});
});

// Send info to create new movie
router.post('/', (req, res, next) => {
  console.log(req.body)
  
  // games.findOne({ round })
  //   .then(game => {
  //     if (game !== null) {
  //       res.render('/', { message: 'The game already exists' });
  //       return;
  //     }
  //   }
  // )

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
    results,
    users
  } = req.body;

  



  games.findOne({round})
  .then(game => {
    console.log(game)
    if (game.round === round) {
      res.render('/', { message: 'The game already exists' });
      console.log("existe")
      return;
    }
    // else{
    //   console.log("NO EXISTE :)")
    // }
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
    users
  })
  newGame.save()
    .then((games) => {
      res.redirect('/');
    })
    .catch((error) => {
      console.log('Error while creating new game');
      res.render("/");
    })

    
  })



  
});

module.exports = router;
