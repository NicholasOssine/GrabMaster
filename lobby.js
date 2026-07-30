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

function readChallenges() {
  const challenges = [];
  for (const columnElement of document.querySelectorAll(
    '[data-component="OpponentsByTimeControl"]',
  )) {
    const columnName = columnElement.querySelector("h3").textContent.trim();
    for (const cardElement of columnElement.querySelectorAll(
      '[data-component="OpponentCard"]',
    )) {
      const ratingElement = cardElement.querySelector(
        '[class*="OpponentCardRatingNumber"]',
      );
      const ratingText = ratingElement.textContent.trim();
      const rating = ratingText === "New" ? null : Number(ratingText);
      challenges.push({
        column: columnName,
        rating: rating,
        element: cardElement,
      });
    }
  }
  return challenges;
}
