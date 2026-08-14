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

function parseTimeControl(cardElement) {
  const timeText = cardElement
    .querySelector('[data-component="TimeControlTime"]')
    .textContent.trim();

  if (/^\d+\+\d+$/.test(timeText)) return timeText;

  const minutesMatch = timeText.match(/^(\d+)min$/);
  if (minutesMatch !== null) return `${minutesMatch[1]}+0`;
}

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
        timeControl: parseTimeControl(cardElement),
        fideRated: cardElement.querySelector('[data-type="IconFide"]') !== null,
        element: cardElement,
      });
    }
  }
  return challenges;
}

function matchesSettings(challenge, userSettings) {
  if (!userSettings.categories.includes(challenge.column)) return false;
  if (userSettings.gameType === "rated" && !challenge.fideRated) return false;
  if (userSettings.gameType === "casual" && challenge.fideRated) return false;
  if (challenge.rating === null) return userSettings.acceptUnrated;
  if (challenge.rating < userSettings.minRating) return false;
  if (challenge.rating > userSettings.maxRating) return false;
  return true;
}

function tryAccept(challenges) {
  for (const challenge of challenges) {
    if (matchesSettings(challenge, settings)) {
      challenge.element.click();
      chrome.storage.sync.set({ enabled: false });
      return;
    }
  }
}

setInterval(() => {
  if (location.pathname === "/lobby" && settings.enabled)
    tryAccept(readChallenges());
}, 1000);
