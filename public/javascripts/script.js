// window.onload = function(){
//   getApifootball(restApifootball)
// }

let from = document.getElementById("startRound").innerText;
let to = document.getElementById("endRound").innerText;

console.log(from)
console.log(to)

const restApifootball = axios.create({
  baseURL: `https://apiv2.apifootball.com/?action=get_events&from=${from}&to=${to}&country_id=135&league_id=468&APIkey=ce05d1110b0b6ea02a5649e270ed95c243e036dc31a6b0e3f89be14dbe27a160`
})

function getApifootball(restApifootball) {
  return restApifootball
    .get()
    .then(responseFromAPI => responseFromAPI.data)
    .catch(err => console.log("Error is: ", err));
}

document.getElementById("showResults").addEventListener("click", function () {
  getApifootball(restApifootball).then(data => {
    let homeScore = data.map(match => {
      console.log(match.match_hometeam_score)
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
        successes.push(true);
      } else {
        successes.push(false);
      }
    }

    console.log(successes)
    
  })
  
});



// document.getElementById("callTheAPI").addEventListener("click", function () {
//   // let round = document.querySelector("#round").innerText
//   //  let object={
//   //     prop1: value,
//   //     round:round,
//   //   }
//   //   axios.post('/createMatch', object)


//   getApifootball(restApifootball).then(data => {
//     // Show the matches
//     let labels = document.getElementsByClassName("match");
//     for (let i = 0; i < labels.length; i++) {
//       labels[i].innerHTML = data[i].match_hometeam_name + " - " + data[i].match_awayteam_name;
//     }

//     // Show the round
//     document.getElementById("round").innerHTML = data[0].match_round;
//     document.getElementById("round").value = data[0].match_round;


//     let round = document.getElementById("round").innerText;
//     document.querySelector('input[name="round"]').value = round;
//     console.log(round);

//     let match1 = document.getElementById("match1").innerText;
//     document.querySelector('input[name="match1"]').value = match1;

//     let match2 = document.getElementById("match2").innerText;
//     document.querySelector('input[name="match2"]').value = match2;

//     let match3 = document.getElementById("match3").innerText;
//     document.querySelector('input[name="match3"]').value = match3;

//     let match4 = document.getElementById("match4").innerText;
//     document.querySelector('input[name="match4"]').value = match4;

//     let match5 = document.getElementById("match5").innerText;
//     document.querySelector('input[name="match5"]').value = match5;

//     let match6 = document.getElementById("match6").innerText;
//     document.querySelector('input[name="match6"]').value = match6;

//     let match7 = document.getElementById("match7").innerText;
//     document.querySelector('input[name="match7"]').value = match7;

//     let match8 = document.getElementById("match8").innerText;
//     document.querySelector('input[name="match8"]').value = match8;

//     let match9 = document.getElementById("match9").innerText;
//     document.querySelector('input[name="match9"]').value = match9;

//     let match10 = document.getElementById("match10").innerText;
//     document.querySelector('input[name="match10"]').value = match10;


//   });
// });


document.getElementById("clear").addEventListener("click", function () {
  document.getElementById("clear").reset();
})