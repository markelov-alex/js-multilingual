
export default class SelectionUtil {
  static clearSelection () {
    // From https://stackoverflow.com/questions/3169786/clear-text-selection-with-javascript
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty()
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges()
      }
    } else if (document.selection) {  // IE?
      document.selection.empty()
    }
  }
}
