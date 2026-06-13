const input = document.getElementById("driverguess");
const guesses = document.querySelectorAll(".guess");
const stats_button = document.getElementById("stats_button");
const question = document.getElementById("question");
const starts = document.querySelectorAll(".starts");
const wins = document.querySelectorAll(".wins");
const team = document.querySelectorAll(".team");
const carnum = document.querySelectorAll(".carnum");
const rokyear = document.querySelectorAll(".rokyear");
const testing = document.querySelectorAll(".testing");
const overlay = document.getElementById("overlay");
const overlay2 = document.getElementById("overlay2");
const mytext = document.getElementById("myText");
const STORAGE_KEY = "Nasgrid_hard_stats";
const DAILY_KEY = "Nasgrid_hard_daily";

const team_logos = {
  "23XI Racing": "team_logo/23xi.png",
  "Joe Gibbs Racing": "team_logo/gibbs.png",
  "Hendrick Motorsports":"team_logo/hendrick.png",
  "Penske": "team_logo/penske.png",
  "Trackhouse Racing": "team_logo/trackhouse.png",
  "Richard Childress Racing": "team_logo/childress.png",
  "Wood Bros" : "team_logo/wood brothers.png",
  "wood Brothers Racing" : "team_logo/wood brothers.png",
  "Front Row Motorsports": "team_logo/front row.png",
  "Spire Motorsports":"team_logo/spire.png",
  "Roush Fenway Keselowski": "team_logo/roush.png",
  "Legacy Motor Club": "team_logo/legcay.png",
  "Hyak Motorsports": "team_logo/hyak.png",
  "Rick Ware Racing": "team_logo/rick ware.png",
  "Haas Factory Team": "team_logo/haas_factory.png",
  "Kaulig Racing" : "team_logo/kaulig.png",
  "Live Fast Motorsports": "team_logo/live fast.png",
  "Team Amerivet" : "team_logo/team_amerivet.png",
  "Beard Motorsports": "team_logo/beard.png",
  "Tricon Garage": "team_logo/tricon_garage.png",
  "The Money Team" : "team_logo/themoneyteam.png",
  "Stewart Haas Racing": "team_logo/stewart-haas.png",
  "Team Hezeberg" : "team_logo/team hezeberg.png",
  "Garage 66" :"team_logo/garage66.png",
  "BJ McLeod Motorsports" : "team_logo/bj_mcleod_motorsports.png",
  "NY Racing" : "team_logo/ny_racing.png",
  "Premium Motorsports" : "team_logo/premium.png",
  "Gaunt Brothers Racing" : "team_logo/gaunt brothers.png",
  "XCI Racing" : "team_logo/xci.png",
  "RBR Enterprises" : "team_logo/rbr_enterprises.png",
  "Obaika" : "team_logo/obaika.png",
  "StarCom" : "team_logo/starcom.png",
  "BK Racing": "team_logo/bkracing.png",
  "Richard Petty Motorsports" : "team_logo/richard petty.png",
  "Leavine Family Racing" :"team_logo/leavine.png",
  "Chip Ganassi Racing" : "team_logo/chip_ganassi.png",
  "Go Fas Racing" : "team_logo/go_fas.png",
  "TriStar Racing" : "team_logo/tristar.png",
  "Circle Sport" : "team_logo/motorsportS_group.png",
  "Hscott Motorsports" :"team_logo/hscott.png",
  "Phoenix Racing" : "team_logo/phoenix.png",
  "Nemco" : "team_logo/nemco.png",
  "Red Bull Racing" : "team_logo/redbull racing.png",
  "Whitney" : "team_logo/whitney.png",
  "Rusty Wallace Racing" : "team_logo/rustywallace.png",
  "Tommy Baldwin Racing" : "team_logo/tommy baldwin racing.png",
  "Swan Racing" : "team_logo/swan.png",
  "Go Green Racing" : "team_logo/go green racing.png",
  "Randy Humphrey Motorsports" : "team_logo/humphrey.png",
  "Brian Keselowski Motorsports" : "team_logo/brian keselowski.png",
  "Phil Parsons Racing" : "team_logo/philparsons.png"
}; 

let dailyGuesses  = [] ;
let wonToday = false;
let finishedToday = false;

let currentGuess = 0;
let driver;
let driverClean;
let correctanswer;
let tempcarnum=0;
let tempdrvcar = 0;

let plays = 0;
let lost =0;
let streak = 0;
let maxstreak = 0;
let wons = 0;
let guessestrack = [0, 0, 0, 0, 0, 0];

let drivers = [];
let cleanedDrivers = [];

function getTodayKey() {
    const today = new Date();
    return today.getFullYear() + "-" +
           String(today.getMonth() + 1).padStart(2, "0") + "-" +
           String(today.getDate()).padStart(2, "0");
}
const savedStats = localStorage.getItem(STORAGE_KEY);

if (savedStats) {
    const stats = JSON.parse(savedStats);

    plays = stats.plays || 0;
    lost = stats.lost || 0;
    streak = stats.streak || 0;
    maxstreak = stats.maxstreak || 0;
    wons = stats.wons || 0;
    guessestrack = stats.guessestrack || [0,0,0,0,0,0];
}
function update() {
    document.getElementById("plays").textContent = "Plays: " + plays;
    document.getElementById("wons").textContent = "Wins: " + wons;
    document.getElementById("lost").textContent = "Losses: " + lost;
    document.getElementById("streak").textContent = "Streak: " + streak;
    document.getElementById("maxstreak").textContent = "Maxstreak: " + maxstreak;

    let max = Math.max(...guessestrack, 1); 

    for (let i = 0; i < 6; i++) {
        let element = document.getElementById((i + 1) + "guess");
        let value = guessestrack[i];
        let percent = (value / max) * 100;

        if (value === 0) {
            element.style.width = "40px";   // match min-width
            element.style.backgroundColor = "rgb(65, 70, 70)"; // gray instead of green
            element.style.justifyContent = "flex-start";
            element.textContent = value;

        } else {
            element.style.width = percent + "%";
            element.style.backgroundColor = "green";
            element.textContent = value;
            element.style.justifyContent = "flex-end";
        }       
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
            plays,
            lost,
            streak,
            maxstreak,
            wons,
            guessestrack
})); 
}
update();

 fetch("drivers.json")
  .then(res => res.json())
  .then(data => {
      drivers = data;

      cleanedDrivers = drivers.map(d =>
          d.name.toLowerCase().replace(/\s/g, "")
      );
      const datalist = document.getElementById("drivers-list");

input.addEventListener("input", () => {
    const value = input.value.toLowerCase();

    datalist.innerHTML = "";

    // don't show anything until 2 letters
    if (value.length < 3) {
        return;
    }

    drivers.forEach(driver => {
        if (driver.name.toLowerCase().includes(value)) {
            const option = document.createElement("option");
            option.value = driver.name;
            datalist.appendChild(option);
        }
    });
});
      startRound();

      
  });



function getDailyDriver(arr) {
    const today = getTodayKey();

    let hash = 0;

    for (let i = 0; i < today.length; i++) {
        hash = ((hash << 5) - hash) + today.charCodeAt(i);
        hash |= 0;
    }

    hash = Math.abs(hash);

    return arr[hash % arr.length];
}
input.value = "";

function startRound() {
    const todayKey = getTodayKey();
    const savedGame = localStorage.getItem(DAILY_KEY);

    if (savedGame) {
        const game = JSON.parse(savedGame);

        if (game.date === todayKey) {
            driver = game.driver;
            driverClean = driver.name.toLowerCase().replace(/\s/g, "");
            currentGuess = game.currentGuess || 0;
            dailyGuesses = game.guesses || [];
            wonToday = game.wonToday || false;
            finishedToday = game.finishedToday || false;

            restoreBoard(); 
            return;
        }
    }
    driver = getDailyDriver(drivers);
    driverClean = driver.name.toLowerCase().replace(/\s/g, "");
    currentGuess = 0;
    dailyGuesses = [];

    input.disabled = false;

    saveDailyProgress();
}
function applyColors(index, guessedDriver) {

    if (guessedDriver.starts === driver.starts) {
        starts[index].parentElement.style.backgroundColor = "green";
    } else if (guessedDriver.starts < driver.starts) {
        starts[index].parentElement.style.backgroundColor = "rgb(230, 135, 18)";
    } else {
        starts[index].parentElement.style.backgroundColor = "rgb(42, 164, 177)";
    }

    if (guessedDriver.wins === driver.wins) {
        wins[index].parentElement.style.backgroundColor = "green";
    } else if (guessedDriver.wins < driver.wins) {
        wins[index].parentElement.style.backgroundColor = "rgb(230, 135, 18)";
    } else {
        wins[index].parentElement.style.backgroundColor = "rgb(42, 164, 177)";
    }

    if (guessedDriver.team === driver.team) {
        team[index].parentElement.style.backgroundColor = "rgb(0, 128, 0)";
    }else if (driver.formteam.includes(guessedDriver.team)){
        team[index].parentElement.style.backgroundColor = "rgb(182, 173, 65)";
    }   
    else{
        team[index].parentElement.style.backgroundColor = "rgb(65, 70, 70)";
    }

    if (guessedDriver.rokyear === driver.rokyear) {
        rokyear[index].parentElement.style.backgroundColor = "green";
    } else if (guessedDriver.rokyear < driver.rokyear) {
        rokyear[index].parentElement.style.backgroundColor = "rgb(230, 135, 18)";
    } else {
        rokyear[index].parentElement.style.backgroundColor = "rgb(42, 164, 177)";
    }
    if(guessedDriver.carnum > 99){
        tempcarnum = guessedDriver.carnum - 100;
    }
    else{
        tempcarnum = guessedDriver.carnum
    }
    if(driver.carnum > 99){
        tempdrvcar = driver.carnum - 100;
    }
    else{
        tempdrvcar = driver.carnum
    }
    if (tempcarnum === tempdrvcar) {
        carnum[index].parentElement.style.backgroundColor = "green";
    }
    else if (driver.forcarnum.includes(guessedDriver.carnum)){
        carnum[index].parentElement.style.backgroundColor = "rgb(182, 173, 65)";
    }   
    else if (tempcarnum < tempdrvcar) {
        carnum[index].parentElement.style.backgroundColor = "rgb(230, 135, 18)";
    }
    else if (tempcarnum > tempdrvcar) {
        carnum[index].parentElement.style.backgroundColor = "rgb(42, 164, 177)";
    }
}
function restoreBoard() {
    for (let i = 0; i < dailyGuesses.length; i++) {
        const guessedDriver = dailyGuesses[i];

        if (!guessedDriver) continue

        guesses[i].textContent = guessedDriver.name;
        starts[i].textContent = guessedDriver.starts;
        wins[i].textContent = guessedDriver.wins;
        carnum[i].textContent = guessedDriver.carnum;
        rokyear[i].textContent = guessedDriver.rokyear;
        
        guesses[i].style.visibility = "visible";
        starts[i].style.visibility = "visible";
        wins[i].style.visibility = "visible";
        team[i].style.visibility = "visible";
        carnum[i].style.visibility = "visible";
        rokyear[i].style.visibility = "visible";
        
        applyColors(i, guessedDriver);
        let logo = document.createElement("img");
        logo.src = team_logos[guessedDriver.team];
        team[i].innerHTML = "";
        team[i].appendChild(logo);

        logo.style.width = "70px";
        logo.style.height = "70px";
        logo.style.objectFit = "contain";
    }
    if (wonToday || finishedToday) {
    input.disabled = true;

    if (wonToday) {
        input.placeholder = "You got it! Come back tomorrow.";
    } else {
        input.placeholder = "The driver was " +  driver.name;
    }
}
    if (currentGuess >= 6) {
        input.disabled = true;
    }
}
function saveDailyProgress() {
    const todayKey = getTodayKey();

    localStorage.setItem(DAILY_KEY, JSON.stringify({
        date: todayKey,
        driver: driver,
        currentGuess: currentGuess,
        guesses: dailyGuesses,
        finishedToday: finishedToday,
        wonToday: wonToday
    }));
}


input.addEventListener("keydown", function(event) {
    
    if (event.key === "Enter") {
        if (drivers.length === 0) {
            input.placeholder = "Loading drivers...";
            return;
        }
        const value = input.value.trim();
        const cleanedValue = value.toLowerCase().replace(/\s/g, "");
        
        if (!cleanedDrivers.includes(cleanedValue)) {
        input.value = "";
        input.placeholder = "Not a valid driver";

        setTimeout(() => {
            input.placeholder = "Enter Driver here...";
        }, 1000);

        return;
}
        if (currentGuess < 6) {
            const guessedDriver = drivers.find(d =>
                d.name.toLowerCase().replace(/\s/g, "") === cleanedValue
                
            );
            guesses[currentGuess].textContent = guessedDriver.name;
            starts[currentGuess].textContent = guessedDriver.starts;
            wins[currentGuess].textContent = guessedDriver.wins;
            team[currentGuess].textContent = "";
            carnum[currentGuess].textContent = guessedDriver.carnum;
            
            if (guessedDriver.carnum > 99) {
                let numStr = String(guessedDriver.carnum);
                carnum[currentGuess].textContent = numStr.slice(1);
            }
            rokyear[currentGuess].textContent = guessedDriver.rokyear;

            let logo = document.createElement("img");
            logo.src = team_logos[guessedDriver.team];
            logo.style.width = "70px";
            logo.style.height = "70px";
            logo.style.objectFit = "contain";
            team[currentGuess].innerHTML = "";
            team[currentGuess].appendChild(logo);

            if (cleanedValue === driverClean) {
            input.disabled = true;
            guesses[currentGuess].style.visibility = "visible";
            starts[currentGuess].style.visibility = "visible";
            wins[currentGuess].style.visibility = "visible";
            team[currentGuess].style.visibility = "visible";
            carnum[currentGuess].style.visibility = "visible";
            rokyear[currentGuess].style.visibility = "visible";

            guesses[currentGuess].parentElement.style.backgroundColor = "green";
            starts[currentGuess].parentElement.style.backgroundColor = "green";
            wins[currentGuess].parentElement.style.backgroundColor = "green";
            team[currentGuess].parentElement.style.backgroundColor = "green";
            carnum[currentGuess].parentElement.style.backgroundColor = "green";
            rokyear[currentGuess].parentElement.style.backgroundColor = "green";
            
            input.value = "";
            correctanswer = driver;
            input.placeholder = "Correct the driver was " +  driver.name;
            wons++;
            streak++;
            plays++;
            guessestrack[currentGuess]++;
            
            if (streak >= maxstreak){
                maxstreak = streak;
            }
            dailyGuesses[currentGuess] = guessedDriver;
            wonToday = true;
            saveDailyProgress();
            update();
            }

            else{
                guesses[currentGuess].style.visibility = "visible";
                starts[currentGuess].style.visibility = "visible";
                wins[currentGuess].style.visibility = "visible";
                team[currentGuess].style.visibility = "visible";
                carnum[currentGuess].style.visibility = "visible";
                rokyear[currentGuess].style.visibility = "visible";
                
                applyColors(currentGuess, guessedDriver);

                dailyGuesses[currentGuess] = guessedDriver;
                currentGuess++;
                saveDailyProgress();
                input.value = "";
            }
            
        }

        if (currentGuess === 6) {
            input.disabled = true;
            input.placeholder = "The driver was " + driver.name ;
            plays++;
            lost++;
            streak = 0;
            finishedToday = true;
            update();
            saveDailyProgress();
            

        }
    }
});






    
question.addEventListener("click", () => {
    overlay.classList.add("active");
});

overlay.addEventListener("click", () => {
    overlay.classList.remove("active");
});

stats_button.addEventListener("click", () => {
    overlay2.classList.add("active");
});

overlay2.addEventListener("click", () => {
    overlay2.classList.remove("active");
});

