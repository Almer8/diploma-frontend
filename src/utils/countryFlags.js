export const countryNameToCode = {
    "Україна": "UA",
    "Польща": "PL",
    "Німеччина": "DE",
    "Франція": "FR",
    "Італія": "IT",
    "Іспанія": "ES",
    "Португалія": "PT",
    "Чехія": "CZ",
    "Словаччина": "SK",
    "Угорщина": "HU",
    "Румунія": "RO",
    "Болгарія": "BG",
    "Молдова": "MD",
    "Білорусь": "BY",
    "Литва": "LT",
    "Латвія": "LV",
    "Естонія": "EE",
    "Сполучене Королівство": "GB",
    "США": "US",
    "Канада": "CA",
    "Австралія": "AU",
    "Китай": "CN",
    "Японія": "JP",
    "Південна Корея": "KR",
    "Індія": "IN",
    "Туреччина": "TR",
    "Грузія": "GE",
    "Казахстан": "KZ",
    "Швеція": "SE",
    "Норвегія": "NO",
    "Фінляндія": "FI",
    "Нідерланди": "NL",
    "Бельгія": "BE",
    "Швейцарія": "CH",
    "Австрія": "AT",
    "Греція": "GR",
    "Ізраїль": "IL"
};


export function getFlagImgUrl(countryUaName, size = 80) {
    const code = countryNameToCode[countryUaName];
    if (!code) return null;
    return `https://flagcdn.com/w${size}/${code.toLowerCase()}.png`;
}
