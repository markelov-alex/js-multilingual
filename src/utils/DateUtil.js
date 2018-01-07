/**
 * Replaced with 'dateformat' lib.
 *  dateFormat(new Date(), 'yyyymmdd_HHMMss')
 */
export default class DateUtil {
  static dateString (date = null, delim = '') {
    date = date || new Date()
    return date.getFullYear() + delim + DateUtil.addZero(date.getMonth() + 1) +
           delim + DateUtil.addZero(date.getDate())
  }
  static timeString (date = null, delim = '') {
    date = date || new Date()
    return date.getHours() + delim + date.getMinutes() + delim + date.getSeconds()
  }
  static dateTimeString (date = null, delim = '_', dateDelim = '', timeDelim = '') {
    date = date || new Date()
    return date.toDateString() + delim + date.toTimeString()
    // return date.getFullYear() + dateDelim + (date.getMonth() + 1) + dateDelim + date.getDate() + delim +
    //   date.getHours() + timeDelim + date.getMinutes() + timeDelim + date.getSeconds()
  }

  static addZero (num) {
    num = String(num)
    return num.length === 1 ? '0' + num : num
  }
}
