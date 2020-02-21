const express = require('express');
const router = express.Router();
const games = require("../models/game");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {
    user: req.user
  });
 
});



// Send info to create new game/bets
router.post('/', (req, res, next) => {
  let userId = req.user._id
  
  function saveUsersBets(user) {
    console.log(user + " lo imprime. VIVA!!")
  }
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
        results,
        users
      } = req.body;

      games.findOne({
          'round': req.body.round
        })
        .then(game => {
          console.log(req.body.round)
          if (game !== null) {
            
            saveUsersBets(userId);
            res.redirect("/")
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
            }
            saveUsersBets(userId);
        })
        // .catch(error => {
        //   console.log('Error trying to edit the movie: ', error);
        // })
})


      module.exports = router;