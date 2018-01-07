import Vue from 'vue'
import Vuex from 'vuex'
// import _ from 'lodash'

import importing from './mixins/importing'
import users from './modules/users'
import projects from './modules/projects'
import documents from './modules/documents'
import web from './mixins/web'
import { createLocalSavePlugin, localSaveMutations } from './plugins/LocalSavePlugin'
import VuexUtil from '../utils/VuexUtil'

Vue.use(Vuex)

/**
 * Application's logic.
 *
 * Vuex Store contains whole business logic of the application
 * including client-server interconnections.
 * Vue components can commit mutations and dispatch actions,
 * displaying changes of state. View can be easily changed,
 * but the core of the application remains in Store.
 */

let options = {
  strict: process.env.NODE_ENV !== 'production',

  state: {
    globalErrorMessage: '',

    // Rough. Not implemented
    historyByDocumentId: {
      21: {
        documentId: 1,
        updatedAt: '2017-10-29 21:31:40',

        versions: [
          {
            userId: 1,
            lastEditAt: '2017-10-21 18:40:17',

            changes: [
              {
                // edit some formatting
                element: 'text>0',
                action: 'set',
                value: '==Act III',
                prev: 'Act III',
                important: false
              },
              {
                // remove x
                'element': 'text>8>2>0',
                'action': 'remove',
                'prev': 'Scene 1'
              },
              {
                // restore x, but in wrong place
                'element': 'text>8>2>2',
                'action': 'insert',
                'value': '=Scene 1'
              }
            ]
          },
          {
            userId: 2,
            lastEditAt: '2017-10-23 18:40:17',

            changes: [
              {
                // move x to its initial position
                'element': 'text>8>2>2',
                'action': 'move',
                'value': 'text>8>2>0'
              },
              {
                // ungroup y array
                'element': 'text>8>2',
                'action': 'ungroup',
                'value': 'text>8>2>2-6'
              }
            ]
          },
          {
            userId: 1,
            lastEditAt: '2017-10-24 18:40:17',

            changes: [
              {
                // group y array back but without the last element
                'element': 'text>8>2-5',
                'action': 'group',
                'value': 'text>8>2>2'
              },
              {
                // append blank
                'element': 'text>8>2',
                'action': 'append',
                'value': ''
              }
            ]
          }
        ]
      }
    }
  },
  mutations: {
    ...localSaveMutations,

    showGlobalError (state, message) {
      let messageText = message
      if (typeof message === 'object') {
        // Message is instance of Error
        if (message.message) {
          messageText = message.message
          // Message is response object
        } else if (message.status) {
          if (message.json && message.body.error) {
            messageText = message.body.error.message
          } else if (message.body) {
            if (process.env.NODE_ENV === 'development') {
              messageText = message.status + ' ' + message.statusText
              messageText += '\nDEV info: ' + String(message.bodyText).slice(0, 200) + '...'
            } else {
              messageText = ''
            }
            messageText += '\nYou can switch to Desktop mode and continue to work offline ' +
                           '(All changes will be saved in local storage and ' +
                           'you can also Export them to file for ensurance)'
          }
        } else {
          messageText = String(message)
        }
      }

      state.globalErrorMessage = messageText
      // console.log('ERROR', state.globalErrorMessage)
    },
    clearGlobalError (state) {
      state.globalErrorMessage = null
      // console.log('ERROR', state.globalErrorMessage)
    }
  },
  actions: {},
  getters: {
    isProduction: (state) => process.env.NODE_ENV === 'production'
  },
  modules: {
    users,
    projects,
    documents
  },
  plugins: [
    createLocalSavePlugin('multilingual_state')
  ]
}

export default new Vuex.Store(VuexUtil.mergeOptions(importing, web, options))
