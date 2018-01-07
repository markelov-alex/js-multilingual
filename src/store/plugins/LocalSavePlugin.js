import _ from 'lodash'

import config from '@/config'

export default createLocalSavePlugin
export function createLocalSavePlugin (key = null, storage = null, saveEveryCommit = true) {
  key = key || 'app_state'
  storage = storage || window.localStorage || window.sessionStorage

  return store => {
    // Enabled if true or undefined
    if (config.localSaveEnabled === false) {
      return
    }

    console.log('-=LSave  LOCAL SAVE PLUGIN')
    // Load previous state on very start
    loadData()

    let debouncedSaveData = _.debounce(saveData, 1000)
    // Save whole state on any mutation (debouncing)
    store.subscribe(mutation => {
      // Our special mutations
      if (mutation.type === 'clearLocalStorage') {
        saveData(null)
      } else if (mutation.type === 'saveToLocalStorageNow') {
        console.log('-=LSave (SAVE NOW)')
        saveData(store.state)
      } else if (mutation.type === 'stateChanged' || saveEveryCommit) {
        // console.log('-=LSave (mutation causing save)')
        debouncedSaveData(store.state)
      }
    })

    function loadData () {
      console.log('-=LSave (LOAD STATE)')
      let data = storage.getItem(key)
      if (data) {
        try {
          let json = JSON.parse(data)
          if (json) {
            store.replaceState(json)
            // -store.commit('importState', {data: json})
          }
        } catch (error) {
          console.warn('Loading failed!', error)
          console.warn('Loading failed! Bad JSON data:', data)
        }
      }
    }

    function saveData (data) {
      console.log(data ? '-=LSave (SAVE STATE)' : '-=LSave (CLEAR SAVE)')
      storage.setItem(key, typeof data === 'object' ? JSON.stringify(data) : data)
    }
  }
}

export let localSaveMutations = {
  onLocalStorageLoaded () {
    // Override in your store
  },
  clearLocalStorage () {
    // Empty. Used by plugin
  },
  saveToLocalStorageNow () {
    // Empty. Used by plugin
  },
  stateChanged () {
    // Empty. Used by plugin
  }
}
