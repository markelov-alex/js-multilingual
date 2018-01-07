'use strict'
export default class Parser {
  // static createDocument (rawText) {
  //   return {}
  // }

  static parse (rawText, options = null) {
    if (!rawText) {
      return []
    }

    let result = rawText.split(options.separator || /\n\s\n/)
    if (options) {
      if (options.skipEmpty) {
        result = result.filter(function (val) { return val })
      }
      if (options.trimSpacesAtStart) {
        result = result.map(function (val) {
          return val.replace(/(^[ \t]+(?=[^\s]))/gm, '')
        })
      }
    }
    return result
  }
}
