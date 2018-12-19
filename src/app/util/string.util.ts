export default function initCaps(word: String) {
  return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
}
