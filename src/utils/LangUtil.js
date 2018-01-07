
export default class LangUtil {
  /**
   * @param lang
   * @returns {string} "Hamlet by William Shakespeare" or "Гамлет. Вильям Шекспир"
   */
  static authorDelimeter (lang = null) {
    lang = lang && typeof lang === 'object' ? lang.lang : lang
    return lang === 'en' ? ' by ' : '. '
  }
}
