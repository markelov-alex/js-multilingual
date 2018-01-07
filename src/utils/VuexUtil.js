import _ from 'lodash'

export default class VuexUtil {
  /**
   * _.merge + concatenate array items (to merge 'plugins',
   * because _.merge() overwrites all items on same places).
   * @param options
   * @returns {{}}
   */
  static mergeOptions (...options) {
    let result = {}
    options.forEach(item => {
      _.mergeWith(result, item, (value1, value2) => {
        // Arrays should concat instead of overwriting
        if (_.isArray(value1)) {
          return value1.concat(value2)
        }
      })
    })
    return result
  }
}
