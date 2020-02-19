let matches;

const restApifootball = axios.create({
  baseURL: `https://apiv2.apifootball.com/?action=get_events&from=2020-02-21&to=2020-02-23&country_id=135&league_id=468&APIkey=ce05d1110b0b6ea02a5649e270ed95c243e036dc31a6b0e3f89be14dbe27a160`
})

function getApifootball(restApifootball) {
  restApifootball
  .get()
  .then(responseFromAPI => responseFromAPI.data)
  .catch(err => console.log("Error is: ", err));
}




// let homeTeams = matches.map(match => {
//   return match.match_hometeam_name;
// })

// console.log(homeTeams);

document.getElementById("callTheAPI").addEventListener("click", function(){
  getApifootball(restApifootball);
});

 

