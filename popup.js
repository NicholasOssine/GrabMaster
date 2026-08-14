const DEFAULTS = {
  enabled: false,
  categories: ["Bullet", "Blitz", "Rapid"],
  gameType: "any",
  minRating: 1400,
  maxRating: 1800,
  acceptUnrated: false,
};

let enabled = false;

function fill(savedSettings) {
  document.getElementById("minRating").value = savedSettings.minRating;
  document.getElementById("maxRating").value = savedSettings.maxRating;
  document.getElementById("acceptUnrated").checked =
    savedSettings.acceptUnrated;
  for (const radioButton of document.querySelectorAll(
    'input[name="gameType"]',
  )) {
    radioButton.checked = radioButton.value === savedSettings.gameType;
  }
}

function showState() {
  document.getElementById("state").textContent = enabled ? "On" : "Off";
  document.getElementById("state").className = enabled ? "state on" : "state";
  document.getElementById("go").textContent = enabled
    ? "Stop"
    : "Start accepting";
}

function onButton() {
  if (enabled) {
    chrome.storage.sync.set({ enabled: false });
    enabled = false;
    showState();
    return;
  }

  let gameType = "any";
  for (const radioButton of document.querySelectorAll(
    'input[name="gameType"]',
  )) {
    if (radioButton.checked) gameType = radioButton.value;
  }

  chrome.storage.sync.set({
    enabled: true,
    gameType: gameType,
    minRating: Number(document.getElementById("minRating").value),
    maxRating: Number(document.getElementById("maxRating").value),
    acceptUnrated: document.getElementById("acceptUnrated").checked,
  });

  enabled = true;
  showState();
}

chrome.storage.sync.get(DEFAULTS, (savedSettings) => {
  fill(savedSettings);
  enabled = savedSettings.enabled;
  showState();
});

document.getElementById("go").addEventListener("click", onButton);
