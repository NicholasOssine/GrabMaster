const DEFAULTS = {
  enabled: false,
  categories: ["Bullet", "Blitz", "Rapid"],
  gameType: "any",
  minRating: 1400,
  maxRating: 1800,
  acceptUnrated: false,
};

let settings = { ...DEFAULTS };

chrome.storage.sync.get(DEFAULTS, (storedSettings) => {
  settings = storedSettings;
});

chrome.storage.onChanged.addListener((storageChanges) => {
  for (const changedKey of Object.keys(storageChanges)) {
    settings[changedKey] = storageChanges[changedKey].newValue;
  }
});
