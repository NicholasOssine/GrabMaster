const VALID_TIME_CONTROLS = {
  Bullet: ["1+0", "1+1", "1+2", "2+0", "2+1"],
  Blitz: ["3+0", "3+1", "3+2", "3+3", "5+0", "5+3", "10+0"],
  Rapid: ["10+10", "15+0", "15+10", "25+0", "25+10", "45+0", "45+10"],
  Classic: ["60+0", "90+0", "120+0"],
  Daily: ["1d", "3d", "7d"],
};

const DEFAULTS = {
  enabled: false,
  timeControls: [
    ...VALID_TIME_CONTROLS.Bullet,
    ...VALID_TIME_CONTROLS.Blitz,
    ...VALID_TIME_CONTROLS.Rapid,
  ],
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

  for (const checkbox of document.querySelectorAll("#timeControls input"))
    checkbox.checked = savedSettings.timeControls.includes(checkbox.value);

  for (const radioButton of document.querySelectorAll('input[name="gameType"]'))
    radioButton.checked = radioButton.value === savedSettings.gameType;
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

  const timeControls = [];
  for (const checkbox of document.querySelectorAll("#timeControls input")) {
    if (checkbox.checked) timeControls.push(checkbox.value);
  }

  let gameType = "any";
  for (const radioButton of document.querySelectorAll(
    'input[name="gameType"]',
  )) {
    if (radioButton.checked) gameType = radioButton.value;
  }

  chrome.storage.sync.set({
    enabled: true,
    timeControls: timeControls,
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
