var gameData = {
    balls: 0,
    ballsPerClick: 1,
    ballsPerSecond: 0,
    thirdUpgradeCount: 0,
    clickUpgrades: 0,
    kidUpgrades: 0
}

var storeItems = [
    { name: 'Click Upgrade', cost: 10, increment: 1, type: 'click', count: 0 },
    { name: 'Click Upgrade 2', cost: 50, increment: 5, type: 'click', count: 0 },
    { name: 'Click Upgrade 3', cost: 100, increment: 10, type: 'click', count: 0 },
    { name: 'Kid', cost: 200, increment: 1, type: 'auto', count: 0, visible: false, costIncrement: 100 },
    { name: 'Kid Upgrade', baseCost: 500, cost: 500, increment: 100, type: 'auto', count: 0, visible: false }
]

function getBalls() {
    gameData.balls += gameData.ballsPerClick;
    document.getElementById("Balls").innerHTML = gameData.balls + " Balls";
}

function buyItem(index) {
    var item = storeItems[index];
    if (gameData.balls >= item.cost) {
        gameData.balls -= item.cost;
        if (item.type === 'click') {
            gameData.ballsPerClick += item.increment;
            item.count++;
            if (item.name === 'Click Upgrade 3') {
                gameData.thirdUpgradeCount++;
                if (gameData.thirdUpgradeCount >= 5) {
                    storeItems.find(i => i.name === 'Kid').visible = true;
                }
            }
        } else if (item.type === 'auto') {
            if (item.name === 'Kid') {
                gameData.ballsPerSecond += item.increment;
                item.count++;
                storeItems.find(i => i.name === 'Kid Upgrade').visible = true;
            } else if (item.name === 'Kid Upgrade') {
                gameData.ballsPerSecond += item.increment;
                item.count++;
                item.cost += item.baseCost; // Increment the cost for next purchase
            }
        }
        if (item.name !== 'Kid Upgrade') {
            item.cost += item.costIncrement || item.increment * 10; // Increment the cost for next purchase
        }
        document.getElementById("Balls").innerHTML = gameData.balls + " Balls";
        updateStore();
    } else {
        alert("You don't have enough balls to buy this item!");
    }
}

function buyMaxItem(index) {
    var item = storeItems[index];
    while (gameData.balls >= item.cost) {
        buyItem(index);
    }
}

function updateStore() {
    var store = document.getElementById("store");
    store.innerHTML = "";
    storeItems.forEach(function(item, index) {
        if ((item.name === 'Kid' && !item.visible) || (item.name === 'Kid Upgrade' && !item.visible)) {
            return; // Skip displaying hidden items
        }
        store.innerHTML += `
            <div>
                <span>${item.name} - Cost: ${item.cost} Balls ${item.count > 0 ? `(Purchased: ${item.count})` : ''}</span>
                <button onclick="buyItem(${index})">Buy</button>
                <button onclick="buyMaxItem(${index})">Buy Max</button>
            </div>
        `;
    });
}

function collectAutoBalls() {
    gameData.balls += gameData.ballsPerSecond;
    document.getElementById("Balls").innerHTML = gameData.balls + " Balls";
    document.getElementById("BallsPerSecond").innerHTML = `+${gameData.ballsPerSecond} Balls/s`;
}

// Collect balls automatically every second
setInterval(collectAutoBalls, 1000);

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function toggleAudio() {
    var audioElements = document.getElementsByTagName("audio");
    for (var i = 0; i < audioElements.length; i++) {
        audioElements[i].muted = !audioElements[i].muted;
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Open the Game tab by default
    document.querySelector('.tablinks').click();
    updateStore();
});
