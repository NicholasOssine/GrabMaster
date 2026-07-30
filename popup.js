const DEFAULTS = {
  enabled: false,
  categories: ["Bullet", "Blitz", "Rapid"],
  gameType: "any",
  minRating: 1400,
  maxRating: 1800,
  acceptUnrated: false,
};

function fill(savedSettings) {
  document.getElementById("minRating").value = savedSettings.minRating;
  document.getElementById("maxRating").value = savedSettings.maxRating;
  document.getElementById("acceptUnrated").checked =
    savedSettings.acceptUnrated;
  for (const checkbox of document.querySelectorAll("#categories input")) {
    checkbox.checked = savedSettings.categories.includes(checkbox.value);
  }
  for (const radioButton of document.querySelectorAll(
    'input[name="gameType"]',
  )) {
    radioButton.checked = radioButton.value === savedSettings.gameType;
  }
}

function onButton() {
  const categories = [];
  for (const checkbox of document.querySelectorAll("#categories input")) {
    if (checkbox.checked) categories.push(checkbox.value);
  }

  let gameType = "any";
  for (const radioButton of document.querySelectorAll(
    'input[name="gameType"]',
  )) {
    if (radioButton.checked) gameType = radioButton.value;
  }

  chrome.storage.sync.set({
    enabled: true,
    categories: categories,
    gameType: gameType,
    minRating: Number(document.getElementById("minRating").value),
    maxRating: Number(document.getElementById("maxRating").value),
    acceptUnrated: document.getElementById("acceptUnrated").checked,
  });
}

chrome.storage.sync.get(DEFAULTS, (savedSettings) => {
  fill(savedSettings);
});

document.getElementById("go").addEventListener("click", onButton);
