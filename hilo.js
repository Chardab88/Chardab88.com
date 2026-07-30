const newdriv = document.getElementById("newdriv");
const olddriv = document.getElementById("olddriv");
const olddrivpic = document.getElementById("olddrivpic");
const newdrivpic = document.getElementById("newdrivpic");

let stat = "blurgh";
const stats = [
    { name: "starts",    weight: 20 },
    { name: "wins",      weight: 20 },
    { name: "dnfs",      weight: 5  },
    { name: "dnqs",      weight: 5  },
    { name: "top 5s",    weight: 15 },
    { name: "top 10s",   weight: 10 },
    { name: "poles",     weight: 15 },
    { name: "laps lead", weight: 10 },
];
let drivers = [];
let streak = 0;
let maxstreak = Number(localStorage.getItem("maxStreak")) || 0;
document.getElementById("maxstreak").textContent = maxstreak;

fetch("hilodriv.json")
  .then(res => res.json())
  .then(data => {
      drivers = data;
randomstat();
randomnewdriver();
randomolddriver();
pickNextDriver();
  });


function randomstat() {
    const total = stats.reduce((sum, s) => sum + s.weight, 0);
    let rand = Math.random() * total;
    
    for (const s of stats) {
        rand -= s.weight;
        if (rand <= 0) {
            stat = s.name;
            document.getElementById("stat").textContent = stat;
            return;
        }
    }
}

function randomolddriver() {
    olddriver = drivers[Math.floor(Math.random() * drivers.length)];

    document.getElementById("olddriv").textContent = olddriver.name;
    olddrivpic.src = `wallimgss/${olddriver.img}`;
    }
function randomnewdriver() {
    newdriver = drivers[Math.floor(Math.random() * drivers.length)];

    document.getElementById("newdriv").textContent = newdriver.name;
    newdrivpic.src = `wallimgss/${newdriver.img}`;
    
    document.getElementById("streak").textContent = streak;
    randomstat();
}



let nextdriver = null;

function pickNextDriver() {

    nextdriver = drivers[Math.floor(Math.random() * drivers.length)];

    while (nextdriver == newdriver){
        nextdriver = drivers[Math.floor(Math.random() * drivers.length)];
    }
    // preload the image immediately
    const preload = new Image();
    preload.src = `wallimgss/${nextdriver.img}`;
}

function advanceRound() {
    olddriver = newdriver;
    document.getElementById("olddriv").textContent = olddriver.name;
    olddrivpic.src = `wallimgss/${olddriver.img}`;

    newdriver = nextdriver;
    document.getElementById("newdriv").textContent = newdriver.name;
    newdrivpic.src = `wallimgss/${newdriver.img}`;

    pickNextDriver(); // pick and preload the one after that
}
function playShutter(stat) {
    const oldShutter = document.getElementById("oldShutter");
    const newShutter = document.getElementById("newShutter");

    const oldText = document.getElementById("oldShutterText");
    const newText = document.getElementById("newShutterText");

    const oldVal = olddriver[stat];
    const newVal = newdriver[stat];

    oldText.textContent = `${olddriver.name}: ${oldVal}`;
    newText.textContent = `${newdriver.name}: ${newVal}`;

    // drop down
    oldShutter.classList.add("down");
    newShutter.classList.add("down");

    setTimeout(() => {
        // lift up
        oldShutter.classList.remove("down");
        newShutter.classList.remove("down");

        oldShutter.classList.add("up");
        newShutter.classList.add("up");
    }, 600);

    setTimeout(() => {
        oldShutter.classList.remove("up");
        newShutter.classList.remove("up");
    }, 1000);
}
function getResult(stat) {
    const oldVal = olddriver[stat];
    const newVal = newdriver[stat];

    if (oldVal === newVal) return "tie";

    return oldVal > newVal ? "oldHigher" : "newHigher";
}
function isCorrectPick(userPickedOld, result) {
    if (result === "tie") return true;

    if (result === "oldHigher" && userPickedOld) return true;
    if (result === "newHigher" && !userPickedOld) return true;

    return false;
}

function playShutter(stat, result, correct) {
    const oldShutter = document.getElementById("oldShutter");
    const newShutter = document.getElementById("newShutter");

    const oldText = document.getElementById("oldShutterText");
    const newText = document.getElementById("newShutterText");

    const oldVal = olddriver[stat];
    const newVal = newdriver[stat];

    oldText.textContent = `${olddriver.name}: ${oldVal}`;
    newText.textContent = `${newdriver.name}: ${newVal}`;

    oldShutter.className = "shutter old-shutter";
    newShutter.className = "shutter new-shutter";

    if (!correct && result !== "tie") {
        oldShutter.style.background = "red";
        newShutter.style.background = "red";
    }

    else if (result === "tie") {
        oldShutter.style.background = "rgb(182, 173, 65)";
        newShutter.style.background = "rgb(182, 173, 65)";
    }

    else {
        if (result === "oldHigher") {
            oldShutter.style.background = "rgb(230, 135, 18)";
            newShutter.style.background = "rgb(42, 164, 177)";
        } else {
            oldShutter.style.background = "rgb(42, 164, 177)";
            newShutter.style.background = "rgb(230, 135, 18)";
        }
    }
    oldShutter.classList.add("down");
    newShutter.classList.add("down");
    setTimeout(() => {
        oldShutter.classList.remove("down");
        newShutter.classList.remove("down");
    }, 600);
}


newdriv.addEventListener("click", function () {
    pickNextDriver(); // preload starts immediately

    const result = getResult(stat);
    const correct = isCorrectPick(false, result);
    
    if (correct) {
        streak++;
         if (streak > maxstreak) {
            maxstreak = streak;
            localStorage.setItem("maxStreak", maxstreak);
            document.getElementById("maxstreak").textContent = maxstreak;
        }

    } else {
        if (streak > maxstreak) {
            maxstreak = streak;
            localStorage.setItem("maxStreak", maxstreak);
            document.getElementById("maxstreak").textContent = maxstreak;
        }
        streak = 0;
    }

    document.getElementById("streak").textContent = streak;
    document.getElementById("maxstreak").textContent = maxstreak;

    playShutter(stat, result, correct);

    setTimeout(() => {
        advanceRound();
        randomstat();
    }, 800);
});

olddriv.addEventListener("click", function () {
    pickNextDriver(); // preload starts immediately

    const result = getResult(stat);
    const correct = isCorrectPick(true, result);
    // ... rest of your code unchanged ...
    if (correct) {
        streak++;
         if (streak > maxstreak) {
            maxstreak = streak;
            localStorage.setItem("maxStreak", maxstreak);
            document.getElementById("maxstreak").textContent = maxstreak;
        }
        
    } else {
        if (streak > maxstreak) {
            maxstreak = streak;
            localStorage.setItem("maxStreak", maxstreak);
            document.getElementById("maxstreak").textContent = maxstreak;
        }
        streak = 0;
    }

    document.getElementById("streak").textContent = streak;
    document.getElementById("maxstreak").textContent = maxstreak;

    playShutter(stat, result, correct);

    setTimeout(() => {
        advanceRound();
        randomstat();
    }, 800);
});