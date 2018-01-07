import Vue from 'vue'
import _ from 'lodash'
import dateFormat from 'dateformat'
import hash from 'string-hash'
import CheckUtil from '@/utils/CheckUtil'

export default function (api, getEmptyItem, itemName = null) {
  const processUpdateDebounced = _.debounce(processUpdate, 2000)

  return {
    namespaced: true,
    state: {
      itemById: {},
      initial: {
        itemById: {}
      },
      changes: {
        itemById: {}
      }
    },
    mutations: {
      import (state, items) {
        // console.log('commit update', item)
        if (_.isEmpty(items)) {
          return
        }
        items = Array.isArray(items) ? items : [items]

        for (const item of items) {
          if (!confirm('Overwrite ' + (itemName || 'item') + ' "' + item.name +
                       '" with id: ' + item.id + '?')) {
            continue
          }
          // Save current state to enable reverting
          Vue.set(state.initial.itemById, item.id, _.cloneDeep(state.itemById[item.id]))

          if (state.itemById[item.id]) {
            // Update
            state.itemById[item.id] = _.merge({}, state.itemById[item.id], item)
          } else {
            // Create
            Vue.set(state.itemById, item.id, item)
          }
        }
      },
      importChanges (state, changes) {
        if (changes) {
          if (!state.changes) {
            state.changes = {}
          }
          _.merge(state.changes, changes)
        }
      },

      /**
       * Commit on get data from server (getItems, getItem).
       *
       * @param state
       * @param itemsChanges Object | Array of Object
       */
      update (state, itemsChanges) {
        // console.log('(commit) Update', itemName, itemsChanges)
        if (_.isEmpty(itemsChanges)) {
          return
        }
        itemsChanges = Array.isArray(itemsChanges) ? itemsChanges : [itemsChanges]

        for (const itemChanges of itemsChanges) {
          const item = state.itemById[itemChanges.id]

          // On editing changed
          if (!item || (itemChanges.editing !== undefined &&
                        itemChanges.editing !== item.editing)) {
            if (!item || !item.editing) {
              // Save initial state before start editing
              // (Don't use Vue.set() as don't want to watch for this)
              state.initial.itemById[itemChanges.id] = _.cloneDeep(item || itemChanges)
              // console.log('REVRT set initial', itemChanges.id, state.initial)
            } else {
              delete state.initial.itemById[itemChanges.id]
              // console.log('REVRT delete initial', itemChanges.id, state.initial)
            }
          }

          if (itemChanges.deleted) {
            // Delete
            // console.log('  commit update: delete', item, itemChanges)
            Vue.delete(state.itemById, itemChanges.id)
            continue
          }
          if (item) {
            // Update
            // console.log('  (commit update) update', item, itemChanges)
            // (_.merge() cannot override arrays)
            // _.merge(item, itemChanges)
            // console.log('(commit) MERGE', item, itemChanges)
            _.mergeWith(item, itemChanges, (curValue, newValue) => {
              if (_.isArray(curValue)) {
                if (newValue.merge) {
                  delete newValue.merge
                  // console.log('(commit)  merge&set mergedNewValue:', _.merge([], curValue, newValue),
                  //   'prevValue:', curValue, 'newValue:', newValue)
                  // (_.merge([], - important for reactiveness)
                  return _.merge([], curValue, newValue)
                }
                // console.log('(commit)  set newValue:', newValue, 'prevValue:', curValue)
                return newValue
              }
            })
            // console.log('  (commit update)   Merge', item, itemChanges)
            // Object.assign(item, itemChanges)
          } else {
            // Create
            // console.log('  (commit update) create', item, itemChanges)
            Vue.set(state.itemById, itemChanges.id, itemChanges)
          }
          // console.log('(commit) Update', itemName, 'item:', item, 'itemChanges:', itemChanges)
        }
      },
      revert (state, item) {
        const id = item instanceof Object ? item.id : item
        if (!id) {
          return
        }

        const initialData = state.initial && state.initial.itemById ? state.initial.itemById[id] : null
        // console.log('reverting initial:', state.initial)
        if (initialData) {
          // (Note: initialData.editing is always false)
          // console.log('revert current:', state.itemById[id], 'initialData:', initialData)
          state.itemById[id] = _.merge({}, state.itemById[id], initialData)
        }
        if (state.changes.itemById) {
          // delete state.changes.itemById[id]
          Vue.delete(state.changes.itemById, id)
        }
      },

      updateChanges (state, itemChanges) {
        // (Call on request failed with connection error)
        if (itemChanges) {
          if (state.changes.itemById[itemChanges.id]) {
            _.mergeWith(state.changes.itemById[itemChanges.id], itemChanges, (curValue, newValue) => {
              if (_.isArray(curValue)) {
                if (newValue.merge) {
                  // delete newValue.merge
                  // console.log('(commit) updateChanges merge-n-set mergedNewValue:', _.merge([], curValue, newValue),
                  //   'prevValue:', curValue, 'newValue:', newValue)
                  // (_.merge([], - important for reactiveness)
                  return _.merge([], curValue, newValue)
                }
                // console.log('(commit)  set newValue:', newValue, 'prevValue:', curValue)
                return newValue
              }
            })
            _.merge(state.changes.itemById[itemChanges.id], itemChanges)
          } else {
            Vue.set(state.changes.itemById, itemChanges.id, itemChanges)
          }
          // console.log('commit updateChanges itemChanges:', itemChanges,
          //   'changes-object:', state.changes.itemById[itemChanges.id])
        }
      },
      clearChanges (state, item) {
        // console.log('[changes]', 'clearChanges', 'changes-before:', state.changes.itemById[item.id], performance.now())
        // (Call on server request)
        if (item && state.changes.itemById) {
          delete state.changes.itemById[item.id]
          // console.log('[changes]', ' clearChanges', 'changes-after:', state.changes.itemById[item.id], performance.now())
        }
      },
      restoreChanges (state, prevChanges) {
        // console.log('[changes]', 'restoreChanges', 'changes-before:', state.changes.itemById[prevChanges.id], performance.now())
        // (Call on request failed with connection error)
        if (prevChanges) {
          state.changes.itemById[prevChanges.id] = _.merge(prevChanges, state.changes.itemById[prevChanges.id])
          // console.log('[changes]', ' restoreChanges', 'changes-after:', state.changes.itemById[prevChanges.id], performance.now())
        }
      },
      fixStateByResponse (state, fixedState) {
        // console.log('[changes]', 'fixStateByResponse response:', fixedState, 'state-before:', state.itemById[fixedState.id], performance.now())
        // We need also replace local items with just created items (with real ids)
        // ?let replace = fixedState.replace
        // delete fixedState.replace
        // ...

        // (Call on request succeeded)
        if (!_.isEmpty(fixedState)) {
          // (Supposed, that state.itemById[fixedState.id] exists)
          // Apply response from server and changes made between request and response
          state.itemById[fixedState.id] = _.merge({}, state.itemById[fixedState.id], fixedState, state.changes.itemById[fixedState.id])
          // console.log('[changes]', ' fixStateByResponse', 'state-after:', state.itemById[fixedState.id], performance.now())
        }
      }
    },
    actions: {
      // Read

      getItems: _.throttle(function (context, ids = null, full = false) {
        return processGet(context, api.getAll, 'update', [ids, full])
      }, 2000, {trailing: false}),
      getItem (context, itemOrId) {
        // console.log('getitem', itemOrId)
        return processGet(context, api.get, 'update', [itemOrId, true])
      },

      // Create

      create (context, initialData = null) {
        // console.log('a createProject', payload, context.state.tempMaxProjectId)
        initialData = {...getEmptyItem(), ...initialData}

        // Create empty data and merge the given params into it
        const user = context.rootGetters.currentUser
        initialData.id = generateId()
        initialData.ownerId = user.id
        initialData.created = false

        return processCreateOrDelete(context, api.create, 'update', initialData)
      },
      duplicate (context, item) {
        if (!item) {
          return
        }

        // Duplicate data
        item = _.cloneDeep(item, true)
        const user = context.rootGetters.currentUser
        item.id = generateId()
        item.ownerId = user.id
        item.created = false

        return processCreateOrDelete(context, api.create, 'update', item)
      },

      // Delete

      delete (context, item) {
        if (!item) {
          return
        }
        if (!context.getters.userCanEdit) {
          console.warn('Current user have no permission to remove the ' + (itemName || 'item'))
          return
        }
        if (!confirm('Are you sure to remove the ' + (itemName || 'item') + '?')) {
          return
        }

        return processCreateOrDelete(context, api.delete, 'update', {id: item.id, deleted: true})
      },

      // Update

      update (context, itemChanges) {
        if (!itemChanges) {
          return
        }
        // console.log('UPDATE', itemName, context.rootState.isDesktopMode, 'itemChanges:', itemChanges, 'state:', context.state)
        context.commit('update', itemChanges)
        context.commit('updateChanges', itemChanges)
        // (itemChanges for id)
        // todo try to send data by subscribing for update
        if (context.rootState.isDesktopMode) {
          const changes = context.state.changes.itemById[itemChanges.id]
          return processUpdateDebounced(context, api.update, 'update', changes)
        }
        // return processUpdateDebounced(context, changes.created ? api.update : api.save, 'update', changes)
      },
      updateNow (context, itemChanges) {
        if (!itemChanges) {
          return
        }
        if (context.rootState.isDesktopMode) {
          context.commit('update', itemChanges)
        }
        context.commit('updateChanges', itemChanges)
        // (itemChanges for id)
        const changes = context.state.changes.itemById[itemChanges.id]
        processUpdateDebounced(context, api.update, 'update', changes)
        return processUpdateDebounced.flush()
        // return processUpdateDebounced(context, changes.created ? api.update : api.save, 'update', changes).flush()
      },

      // Export

      exportToFile (context, item) {
        const data = context.getters.itemsDataForExportByIds(item.id)
        const fileName = (itemName ? itemName + '_' : '') + item.name +
                         '_' + dateFormat(new Date(), 'yyyymmdd_HHMMss')
        context.dispatch('exportData', {data, fileName}, {root: true})
      },

      // Editing

      toggleEditing (context, item) {
        // console.log('TOGGLE EDIT', item)
        // Toggle editing
        context.dispatch('update', {id: item.id, editing: !item.editing})
      },
      save (context, item) {
        // console.log('SAVE', item)
        context.dispatch('updateNow', {id: item.id, editing: false})
      },
      cancel (context, item) {
        // console.log('CANCEL', item)
        context.commit('revert', item)
        context.dispatch('updateNow', {id: item.id, editing: false})
        // -
        // context.dispatch('updateNow', item)
      }
    },
    getters: {
      userCanEdit (state, getters, rootState, rootGetters) {
        return item => CheckUtil.userCanEditItem(rootGetters.currentUser, item)
      },
      itemsDataForExportByIds: (state, getters, rootState, rootGetters) => (ids) => {
        if (!ids) {
          return null
        }
        if (!Array.isArray(ids)) {
          ids = [ids]
        } else {
          // Only unique
          ids = new Set(ids)
        }
        const itemDataArray = []
        ids.forEach(id => {
          const itemData = state.itemById[id]
          itemDataArray.push(itemData)
        })
        return itemDataArray
      }
    }
  }

  function generateId () {
    // (userId can be omitted)
    const s = String(Math.random()) + '_' + (new Date().getTime())// rootGetters.currentUser.id + '_' +
    // console.log('GENERATE:', s, hash(s))
    return hash(s)
  }

  // (Used in action above)
  // const updateActionDebounced = _.debounce(function (context, 'update', resolve, reject) {
  //   context.dispatch(('update' || 'updateChanges') + 'Now')
  //     .then((result) => { resolve(result) }, (error) => { reject(error) })
  // }, 1000, {maxWait: 3000})

  // C & D of CRUD
  function processCreateOrDelete (context, apiFunc, mutationType, data, useResponse = true) {
    if (context.rootState.isDesktopMode) {
      // Desktop mode
      context.commit(mutationType, data)
      context.dispatch('update', data)
      // Consider
      return Promise.resolve({body: data})
    } else {
      // Web mode
      // console.log('#request', data, mutationType)
      return processErrorAndOnline(context, apiFunc(data)
        .then(response => {
          // console.log('##response', response, mutationType)
          context.commit(mutationType, _.isEmpty(response.body) ? data : response.body)
          return response
        }))
    }
  }

  // R of CRUD
  function processGet (context, apiFunc, mutationType, params = null) {
    return processErrorAndOnline(context, apiFunc(...(params || {}))
      .then(response => {
        context.commit('update', response.body)
        return response
      }))
  }

  // U of CRUD
  function processUpdate (context, apiFunc, mutationType, data) {
    const itemChanges = context.state.changes.itemById[data.id]
    // console.log('[processUpdate] itemChanges:', itemChanges, performance.now())
    context.commit('clearChanges', data)
    return processErrorAndOnline(context, apiFunc(data)
      .then(response => {
        context.commit('fixStateByResponse', response.body)
        // -// Fix changes from server
        // context.commit('update', response.body || itemChanges)
        // // Apply changes made between request and response
        // context.commit('update', context.state.changes.itemById[response.id])
        return response
      })
      .catch(error => {
        context.commit('restoreChanges', itemChanges)
        throw error
      }))
  }

  function processErrorAndOnline (context, promise) {
    return promise
      .then(response => {
        console.log('  (API) response:', response)
        context.commit('clearGlobalError', null, {root: true})// ? - todo make some separate connection error
        context.commit('setOnline', true, {root: true})
        return response
      }, error => {
        if (!context.rootState.isDesktopMode) {
          context.commit('showGlobalError', error, {root: true})
        }
        if (!error.status || error.status === 404) {
          context.commit('setOnline', false, {root: true})
        }
        throw error
      })
  }
}
