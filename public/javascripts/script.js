window.onload = function () {



  let totalPoints = 0;
  let from1 = document.getElementById("startRound1").innerText;
  let to1 = document.getElementById("endRound1").innerText;
  let from2 = document.getElementById("startRound2").innerText;
  let to2 = document.getElementById("endRound2").innerText;



  const restApifootball1 = axios.create({
    baseURL: `https://apiv2.apifootball.com/?action=get_events&from=${from1}&to=${to1}&country_id=135&league_id=468&APIkey=cb3fb22f77cddb8834401c2aa8adc08f5ed3245cb4fb9ac5ebd5a5986919c478`
  })

  const restApifootball2 = axios.create({
    baseURL: `https://apiv2.apifootball.com/?action=get_events&from=${from2}&to=${to2}&country_id=135&league_id=468&APIkey=cb3fb22f77cddb8834401c2aa8adc08f5ed3245cb4fb9ac5ebd5a5986919c478`
  })

  const restApifootball3 = axios.create({
    baseURL: `https://apiv2.apifootball.com/?action=get_predictions&from=${from1}&to=${to1}&country_id=135&league_id=468&APIkey=cb3fb22f77cddb8834401c2aa8adc08f5ed3245cb4fb9ac5ebd5a5986919c478`
  })





  function getApifootball1(restApifootball1) {
    return restApifootball1
      .get()
      .then(responseFromAPI => responseFromAPI.data)
      .catch(err => console.log("Error is: ", err));
  }

  function getApifootball2(restApifootball2) {
    return restApifootball2
      .get()
      .then(responseFromAPI => responseFromAPI.data)
      .catch(err => console.log("Error is: ", err));
  }

  function getApifootball3(restApifootball3) {
    return restApifootball3
      .get()
      .then(responseFromAPI => responseFromAPI.data)
      .catch(err => console.log("Error is: ", err));
  }

  getApifootball1(restApifootball1).then(data => {
    // Data
    let matchDate = data.map(match => {
      return match.match_date;
    })

    let matchTime = data.map(match => {
      return match.match_time;
    })

    let matchStadium = data.map(match => {
      return match.match_stadium;
    })

    let matchReferee = data.map(match => {
      return match.match_referee;
    })

    let matchHomeBadge = data.map(match => {
      return match.team_home_badge;
    })

    let matchAwayBadge = data.map(match => {
      return match.team_away_badge;
    })

    let matchesTeams = [];
    for (let i = 0; i < 10; i++) {
      matchesTeams.push(document.getElementById("match" + i).innerText)
    }

    let matchNumbers = (number) => {
      document.getElementById("day").innerText = matchDate[number];
      document.getElementById("time").innerText = matchTime[number];
      document.getElementById("stadium").innerText = matchStadium[number];
      document.getElementById("referee").innerText = matchReferee[number];
      document.getElementById("home-badge").src = matchHomeBadge[number];
      document.getElementById("away-badge").src = matchAwayBadge[number];
      document.getElementById("match-teams").innerText = matchesTeams[number];
      document.getElementById("match-number").innerText = (number + 1).toString();
      document.getElementById("match-number").innerText = (number + 1).toString();
      document.getElementById("games-info").style.display = "none";
      document.getElementById("lg").style.display = "block";
    }
    // Data init
    matchNumbers(0);


    document.getElementById("datamatch0").addEventListener("click", function () {
      matchNumbers(0)
    })

    document.getElementById("datamatch1").addEventListener("click", function () {
      matchNumbers(1)
      console.log("it works")
    })

    document.getElementById("datamatch2").addEventListener("click", function () {
      matchNumbers(2)
    })

    document.getElementById("datamatch3").addEventListener("click", function () {
      matchNumbers(3)
    })

    document.getElementById("datamatch4").addEventListener("click", function () {
      matchNumbers(4)
    })

    document.getElementById("datamatch5").addEventListener("click", function () {
      matchNumbers(5)
    })

    document.getElementById("datamatch6").addEventListener("click", function () {
      matchNumbers(6)
    })

    document.getElementById("datamatch7").addEventListener("click", function () {
      matchNumbers(7)
    })

    document.getElementById("datamatch8").addEventListener("click", function () {
      matchNumbers(8)
    })

    document.getElementById("datamatch9").addEventListener("click", function () {
      matchNumbers(9)
    })

    // Get info for H2H
    let homeTeam = data.map(match => {
      return match.match_hometeam_name;
    })



    let awayTeam = data.map(match => {
      return match.match_awayteam_name;
    })





  })



  getApifootball2(restApifootball2).then(data => {
    // Score table
    let homeScore = data.map(match => {

      return match.match_hometeam_score;
    })

    let awayScore = data.map(match => {
      return match.match_awayteam_score;
    })

    let scores = []
    for (let i = 0; i < homeScore.length; i++) {
      if (homeScore[i] === "" && awayScore[i] === "") {
        scores.push("-")
      } else {
        if (homeScore[i] > awayScore[i]) {
          scores.push("1")
        }
        if (homeScore[i] < awayScore[i]) {
          scores.push("2")
        }
        if (homeScore[i] === awayScore[i]) {
          scores.push("X")
        }
      }

    }

    let results = document.getElementsByClassName("results");
    for (let i = 0; i < results.length; i++) {
      results[i].innerText = scores[i]
    }

    let userBets = document.getElementsByClassName("user-bets");
    console.log(userBets)
    let successes = [];
    for (let i = 0; i < results.length; i++) {
      if (userBets[i].innerText === results[i].innerText) {
        if (userBets[i].innerText && results[i].innerText === "-") {
          successes.push(false);
        } else {
          successes.push(true);
        }
      } else {
        successes.push(false);
      }
    }

    console.log(successes)

    let points = document.getElementsByClassName("points");
    for (let i = 0; i < points.length; i++) {
      if (successes[i] === false) {
        points[i].innerText = "-";
      } else {
        points[i].innerText = "+ 1";
        totalPoints++;
      }
    }

    document.getElementById("total-data").innerText = totalPoints;




  })

  getApifootball3(restApifootball3).then(data => {
    let prob1 = data.map(match => {
      let hw = match.prob_HW.split(".");
      return hw[0]
    })

    let probX = data.map(match => {
      let d = match.prob_D.split(".");
      return d[0];
    })

    let prob2 = data.map(match => {
      let aw = match.prob_AW.split(".");
      return aw[0];
    })

    let matchProb = (number) => {
      document.getElementById("one").innerText = prob1[number];
      document.getElementById("x").innerText = probX[number];
      document.getElementById("two").innerText = prob2[number];
    }

    matchProb(0);

    document.getElementById("datamatch0").addEventListener("click", function () {
      matchProb(0);
    })
    document.getElementById("datamatch1").addEventListener("click", function () {
      matchProb(1);
    })
    document.getElementById("datamatch2").addEventListener("click", function () {
      matchProb(2);
    })
    document.getElementById("datamatch3").addEventListener("click", function () {
      matchProb(3);
    })
    document.getElementById("datamatch4").addEventListener("click", function () {
      matchProb(4);
    })
    document.getElementById("datamatch5").addEventListener("click", function () {
      matchProb(5);
    })
    document.getElementById("datamatch6").addEventListener("click", function () {
      matchProb(6);
    })
    document.getElementById("datamatch7").addEventListener("click", function () {
      matchProb(7);
    })
    document.getElementById("datamatch8").addEventListener("click", function () {
      matchProb(8);
    })
    document.getElementById("datamatch9").addEventListener("click", function () {
      matchProb(9);
    })

    // document.getElementById("clear").addEventListener("click", function () {
    //   for (let i = 0; i < 10; i++) {
    //     document.getElementById("bet_" + i + "_x").checked = true;
    //   }
    // })

  })
}


document.getElementById("lg").addEventListener("click", function () {
  document.getElementById("games-info").style.display = "block";
  document.getElementById("lg").style.display = "none";

  let hh = document.getElementById("match-teams").innerText;
  hh = hh.split(" - ")
  console.log(hh)

  const h2h_1 = axios.create({
    baseURL: `https://apiv2.apifootball.com/?action=get_H2H&firstTeam=${hh[0]}&secondTeam=${hh[1]}&APIkey=cb3fb22f77cddb8834401c2aa8adc08f5ed3245cb4fb9ac5ebd5a5986919c478`
  })

  function heth2h_1(h2h_1) {
    return h2h_1
      .get()
      .then(responseFromAPI => responseFromAPI.data)
      .catch(err => console.log("Error is: ", err));
  }

  heth2h_1(h2h_1).then(data => {

    for (let i = 0; i < 2; i++) {
      let ht = data.firstTeam_VS_secondTeam[i].match_hometeam_name;
      let at = data.firstTeam_VS_secondTeam[i].match_awayteam_name;
      let hs = data.firstTeam_VS_secondTeam[i].match_hometeam_score;
      let as = data.firstTeam_VS_secondTeam[i].match_awayteam_score;
      let hdate = data.firstTeam_VS_secondTeam[i].match_date;
      document.getElementsByClassName("hh-teams")[i].innerText = ht + " - " + at;
      document.getElementsByClassName("hh-scores")[i].innerText = hs + " - " + as;
      // document.getElementsByClassName("hh-date")[i].innerText = hdate;
      document.getElementById("ht-lg").innerText = at;
      document.getElementById("at-lg").innerText = ht;
    }

    for (let i = 0; i < 3; i++) {
      let htlg = data.firstTeam_lastResults[i].match_hometeam_name;
      let atlg = data.firstTeam_lastResults[i].match_awayteam_name;
      let hslg = data.firstTeam_lastResults[i].match_hometeam_score;
      let aslg = data.firstTeam_lastResults[i].match_awayteam_score;
      document.getElementsByClassName("htlg-teams")[i].innerText = htlg + " - " + atlg;
      document.getElementsByClassName("htlg-scores")[i].innerText = hslg + " - " + aslg;

      let htlg2 = data.secondTeam_lastResults[i].match_hometeam_name;
      let atlg2 = data.secondTeam_lastResults[i].match_awayteam_name;
      let hslg2 = data.secondTeam_lastResults[i].match_hometeam_score;
      let aslg2 = data.secondTeam_lastResults[i].match_awayteam_score;
      document.getElementsByClassName("atlg-teams")[i].innerText = htlg2 + " - " + atlg2;
      document.getElementsByClassName("atlg-scores")[i].innerText = hslg2 + " - " + aslg2;
    }
  })

})

document.getElementById("go-lastkiniela").addEventListener("click", function () {
  document.getElementById("last-kiniela").style.display = "block";
  document.getElementById("ranking-table").style.display = "none";
  document.getElementById("go-lastkiniela").style.display = "none";
  document.getElementById("go-ranking").style.display = "block";
})

let = rankingLoad = false;
document.getElementById("go-ranking").onclick = function () {

  document.getElementById("last-kiniela").style.display = "none";
  document.getElementById("ranking-table").style.display = "block";
  document.getElementById("go-lastkiniela").style.display = "block";
  document.getElementById("go-ranking").style.display = "none";

  // Ranking function
  if (!rankingLoad) {


    let usersNames = document.getElementsByClassName("users-names");
    let usersBets = document.getElementsByClassName("users-bets");
    let users = []
    let bets = []

    for (let i = 0; i < usersNames.length; i++) {
      users.push(document.getElementsByClassName("users-names")[i].innerText)
      bets.push(document.getElementsByClassName("users-bets")[i].innerText)
    }

    let betsSep = []
    for (let i = 0; i < bets.length; i++) {
      betsSep.push(bets[i].split(","));
    }

    if (users.length === 0) {
      console.log("No hay usuarios")
     document.getElementById("not-users").style.display = "block"
    } else {



      let res = []
      let results = document.getElementsByClassName("results");
      for (let i = 0; i < 10; i++) {
        res.push(results[i].innerText)
      }

      console.log(betsSep)

      let countArr = []
      let count = 0;
      for (let i = 0; i < betsSep.length; i++) {
        for (let j = 0; j < 10; j++) {

          if (res[j] === betsSep[i][j]) {
            count++;
          }

        }
        countArr.push(count);
        count = 0;
      }

      rankingArr = []
      for (let i = 0; i < users.length; i++) {
        rankingArr[i] = {
          name: users[i],
          score: countArr[i]
        }
      }

      rankingArr.sort((a, b) => (a.score < b.score) ? 1 : -1)

      console.log(rankingArr)

      for (let i = 0; i < rankingArr.length; i++) {
        document.getElementById("usersRanking").innerHTML += `<p>${rankingArr[i].name}</p>`
        document.getElementById("usersPos").innerHTML += `<p>${i + 1}</p>`
        document.getElementById("usersScores").innerHTML += `<p>${rankingArr[i].score.toString()}</p>`
      }
    }
  }
  rankingLoad = true;

};