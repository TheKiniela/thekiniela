let CronJob = require('cron').CronJob;
const axios = require('axios').default;
const connectMongo = require('connect-mongo');
const Game = require("./models/game");

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
      console.log("ENTRA EN LA FUNCIÓN PARA CREAR JUEGO")
    const restApifootball = axios.create({
      baseURL: `https://apiv2.apifootball.com/?action=get_events&from=${startDate}&to=${endDate}&country_id=135&league_id=468&APIkey=cb3fb22f77cddb8834401c2aa8adc08f5ed3245cb4fb9ac5ebd5a5986919c478`
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

  startDate = "2020-02-21"
  endDate = "2020-02-23"
  
  //createGame();