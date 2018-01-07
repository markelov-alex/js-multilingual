import _ from 'lodash'
import dateFormat from 'dateformat'

import FileUtil from '@/utils/FileUtil'
// import DateUtil from '@/utils/DateUtil'

/**
 * Merge to root Store to add import/export functionality to
 * projects+documents functionality.
 *
 * Using in store/index.jx:
 *  import importing from './mixins/importing
 *  new Vuex.Store(VuexUtil.mergeOptions(importing, options))
 *
 * Depends on:
 * - showGlobalError and clearGlobalError mutations from store/index.js,
 * - projects/add and addDocument mutations from corresponding modules.
 */
export default {
  state: {
    defaultExportFileName: 'multilingual'
  },
  mutations: {
    // importState (state, {data}) {
    //   Object.assign(state, data)
    // }
  },
  actions: {
    // Import/Export
    // Step 1
    // importAllFromFile (context, file) {
    //   context.dispatch('importFile', {file, type: 'all'})
    // },
    // importProjectFromFile (context, file) {
    //   context.dispatch('importFile', {file, type: 'project'})
    // },
    // importDocumentFromFile (context, file) {
    //   context.dispatch('importFile', {file, type: 'document'})
    // },
    exportStateToFile (context, payload) {
      let fileName = payload ? payload.fileName : ''
      // let data = context.getters.allDataAsString
      let data = _.clone(context.state)
      if (!fileName) {
        // fileName = 'export_multilingual_' + DateUtil.dateTimeString()
        fileName = 'export_multilingual_state_' + dateFormat(new Date(), 'yyyymmdd_HHMMss')
      }
      context.dispatch('exportData', {data, fileName})
    },

    // Step 2
    importFile (context, file) {
      FileUtil.loadFile(file, function (rawData) {
        let data
        try {
          // console.log('importfile', rawData)
          data = JSON.parse(rawData)
          // console.log(' importfile', data)
          context.commit('clearGlobalError', {message: 'Nothing to export'})
        } catch (error) {
          // Consider that JSON begins with '{' otherwise it's not JSON
          if (rawData[0] === '{') {
            // Show JSON error
            context.commit('showGlobalError', {message: String(error)})
          } else {
            context.dispatch('parseData', rawData)
            return
          }
        }
        context.dispatch('importData', data)
      })
    },

    // Step 3
    // ?
    parseData (context, rawData) {
      rawData = FileUtil.encodeRawText(rawData)
      // ...
    },
    importState (context, data) {
      this.replaceState(data)
    },
    importData (context, data) {
      console.log('importdata data:', data)
      console.log(' -importdata state:', context.state)
      if (data.defaultExportFileName) {
        // Import state
        this.replaceState(data)
        return
      }
      context.commit('projects/import', data.projects)
      context.commit('projects/importChanges', data.projectsChanges)
      context.commit('documents/apply', data)
      console.log(' - importdata state:', context.state)
      // let type = data.exportType
      // console.log('importdata', type, data)
      // if (type === 'all') {
      //   this.replaceState(data)
      //   // context.commit('importState', {data})
      //   context.commit('saveToLocalStorage')
      // } else if (type === 'project') {
      //   // Import related documents
      //   let currentDocuments = data.currentDocuments
      //   delete data.currentDocuments
      //   if (currentDocuments) {
      //     currentDocuments.forEach(document => context.commit('addDocument', {document}))
      //   }
      //   context.commit('projects/add', data)
      // } else if (type === 'document') {
      //   context.commit('addDocument', data)
      // }
    },
    exportData (context, {data, fileName}) {
      if (data) {
        fileName = fileName || context.state.defaultExportFileName || 'data'
        if (typeof data === 'object') {
          data = JSON.stringify(data)
        }
        FileUtil.saveToFile(FileUtil.addJsonExtIfNeeded(fileName), data)
      } else {
        context.commit('showGlobalError', {message: 'Nothing to export'})
      }
    }
  },
  getters: {
    allDataAsString (state) {
      return JSON.stringify(state)
    }
  }
}
