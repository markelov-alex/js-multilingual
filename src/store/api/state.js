import Vue from 'vue'

// Not used
export default {
  /**
   * Get all state data on app start.
   */
  getAll () {
    return Vue.http.get('state')
  },

  /**
   * Update whole state's changes by single request (for optimization).
   * @param data
   */
  updateAll (data) {
    return Vue.http.patch('state', data)
  }
}
