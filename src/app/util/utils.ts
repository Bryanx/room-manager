export function initCaps(word: String) {
  return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
}

export function getEnumValues(enumObject: Object) {
  const onlyNumbersRegex = new RegExp('^[0-9]+$');
  return Object.keys(enumObject).filter(key => {
    return !onlyNumbersRegex.test(key);
  });
}
