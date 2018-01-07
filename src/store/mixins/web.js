// import _ from 'lodash'

const setOnlineFalseTryCount = 2
/**
 * Mix-in to root store object as it is common functionality.
 */
export default {
  state: {
    isDesktopMode: true,
    isSyncOnForDesktop: true,
    isOnline: null,
    onlineFalseTryCount: 0,

    syncInterval: 1000,
    onlineSyncInterval: 1000,
    offlineSyncInterval: 3000
  },
  mutations: {
    // (Override from localSaveMutations)
    onLocalStorageLoaded (state) {
      // On app start, reset properties which saved values don't make any sense
      state.isOnline = null
    },
    stateChanged () {
      // Empty. Used by plugin
    },

    toggleDesktopMode (state, value = null) {
      // console.log('toggleDesktopMode', performance.now())
      if (value === null) {
        state.isDesktopMode = !state.isDesktopMode
      } else {
        state.isDesktopMode = Boolean(value)
      }
    },
    toggleSyncOnForDesktopMode (state, value = null) {
      // console.log('toggleSyncForDesktopMode', performance.now())
      if (value === null) {
        state.isSyncOnForDesktop = !state.isSyncOnForDesktop
      } else {
        state.isSyncOnForDesktop = Boolean(value)
      }
    },
    setOnline (state, value) {
      // value: true|false|null (null means unknown yet)
      // console.log('setOnline', state.isOnline, state.syncInterval)

      // (Buffer setOnline(false) calls - set false only after 2 setOnline(false) calls)
      // (Needed for desktop mode when routing and getting new item before it was created)
      if (value) {
        state.onlineFalseTryCount = 0
      } else {
        state.onlineFalseTryCount++
        if (state.onlineFalseTryCount < setOnlineFalseTryCount) {
          return
        }
      }

      state.isOnline = value
      state.syncInterval = value ? state.onlineSyncInterval : state.offlineSyncInterval
      // console.log(' setOnline', state.isOnline, state.syncInterval)
    }
  },
  actions: {},
  getters: {
    isWebSyncEnabled: state => !state.isDesktopMode || state.isSyncOnForDesktop
  }
}
