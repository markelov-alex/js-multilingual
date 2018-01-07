import _ from 'lodash'

import config from '@/config'
import createItem from '../mixins/item'
import api from '../api'

const itemMixin = createItem(api.documents, getEmptyDocument, 'document')

export default _.merge({}, itemMixin, {
  state: {},
  mutations: {},
  actions: {
    // Create
    create (context, initialData = null) {
      return itemMixin.actions.create(context, initialData)
        .then(response => {
          const project = context.rootGetters['projects/currentProject']
          const document = context.state.itemById[response.body.id]
          context.dispatch('projects/attachDocument', {project, document}, {root: true})
          context.dispatch('projects/showDocument', {project, document}, {root: true})
          return response
        })
    },
    duplicate (context, item) {
      return itemMixin.actions.duplicate(context, item)
        .then(response => {
          const project = context.rootGetters['projects/currentProject']
          const document = context.state.itemById[response.body.id]
          context.dispatch('projects/attachDocument', {project, document}, {root: true})
          context.dispatch('projects/showDocument', {project, document}, {root: true})
          return response
        })
    },

    // Delete
    delete (context, item) {
      const document = item
      for (const projectId of document.projectIds) {
        const project = context.rootState.projects.itemById[projectId]
        if (project) {
          context.dispatch('projects/dettachDocument',
            {project, document}, {root: true})
        }
      }
      return itemMixin.actions.delete(context, item)
      // .then(response => {
      //   const document = item
      //   for (const projectId of document.projectIds) {
      //     const project = context.rootState.projects.itemById[projectId]
      //     if (project) {
      //       context.dispatch('projects/dettachDocument',
      //         {project, document}, {root: true})
      //     }
      //   }
      //   return response
      // })
    },

    // Edit content:

    setRowValue (context, {document, rowIndex, value}) {
      // console.log('setRowValue', rowIndex, value)
      const changes = {
        id: document.id,
        textRows: {
          [rowIndex]: value,
          merge: true
        }
      }

      if (config.useJsonServerMockApi) {
        // (Json-server will replace whole array)
        changes.textRows = Object.assign(document.textRows.slice(), changes.textRows)
      }

      context.dispatch('update', changes)
    },
    moveRowUp (context, {document, rowIndex}) {
      const i = rowIndex
      if (i > 0) {
        const changes = {
          id: document.id,
          textRows: {
            [i - 1]: document.textRows[i],
            [i]: document.textRows[i - 1],
            merge: true
          }
        }

        if (config.useJsonServerMockApi) {
          // (Json-server will replace whole array)
          changes.textRows = Object.assign(document.textRows.slice(), changes.textRows)
        }

        context.dispatch('update', changes)
      }
    },
    moveRowDown (context, {document, rowIndex}) {
      // console.log('moveDown', document, rowIndex)
      const i = rowIndex
      // if (rowIndex < document.textRows.length - 1) {
      const changes = {
        id: document.id,
        textRows: {
          [i + 1]: document.textRows[i],
          [i]: document.textRows[i + 1],
          merge: true
        }
      }

      if (config.useJsonServerMockApi) {
        // (Json-server will replace whole array)
        changes.textRows = Object.assign(document.textRows.slice(), changes.textRows)
      }

      context.dispatch('update', changes)
      // }
    },
    removeRow (context, {document, rowIndex}) {
      const changes = {
        id: document.id,
        textRows: sliceChanges(document.textRows, rowIndex + 1, -1)
      }

      if (config.useJsonServerMockApi) {
        // (Json-server will replace whole array)
        // changes.textRows = Object.assign({}, document.textRows.slice(), changes.textRows)
        changes.textRows = Object.assign(document.textRows.slice(), changes.textRows)
      } else {
        changes.textRows.merge = true
      }
      changes.textRows.length = (changes.textRows.length || document.textRows.length) - 1

      context.dispatch('update', changes)
    },
    joinRowWithPrevious (context, {document, rowIndex}) {
      const srcTextRows = document.textRows
      const i = rowIndex
      let changes
      if (i > 0) {
        let a = String(srcTextRows[i - 1] || '')
        let b = String(srcTextRows[i] || '')
        // changes = {id: document.id, textRows: Object.assign({}, sliceChanges(srcTextRows, i, -1))}
        changes = {id: document.id, textRows: Object.assign(sliceChanges(srcTextRows, i, -1))}
        changes.textRows[i - 1] = a + b
        changes.textRows.length = (changes.textRows.length || srcTextRows.length) - 1
      } else {
        changes = {id: document.id, textRows: sliceChanges(srcTextRows, 0, 1)}
        changes.textRows[0] = ''
      }

      if (config.useJsonServerMockApi) {
        // (Json-server will replace whole array)
        const length = changes.textRows.length
        // changes.textRows = Object.assign({}, document.textRows.slice(), changes.textRows)
        changes.textRows = Object.assign(document.textRows.slice(), changes.textRows)
        changes.textRows.length = length
      } else {
        changes.textRows.merge = true
      }

      context.dispatch('update', changes)
    },
    createRows (context, {document, rowIndex, removeCount, values}) {
      removeCount = removeCount || 0
      values = values || ['']
      const changes = {id: document.id, textRows: sliceChanges(document.textRows, rowIndex, values.length - removeCount)}
      for (const value of values) {
        changes.textRows[rowIndex] = value
        rowIndex++
      }
      // (Needed if changes.textRows.length increased and decreased during one update synchronization cycle)
      changes.textRows.length = (changes.textRows.length || document.textRows.length) + values.length - removeCount

      if (config.useJsonServerMockApi) {
        // (Json-server will replace whole array - cannot merge)
        // console.log('DOC createrowsafter:', document.textRows.length, changes.textRows.length, document.textRows, changes.textRows)
        changes.textRows = Object.assign(document.textRows.slice(), changes.textRows)
      } else {
        changes.textRows.merge = true
      }

      context.dispatch('update', changes)
    }
  },
  getters: {
    documentsForProject: (state, getters, rootState, rootGetters) => (project) => {
      if (!project || !project.documentIds) {
        return []
      }
      return project.documentIds.map(documentId => state.itemById[documentId])
    },
    displayDocumentsForProject: (state, getters, rootState, rootGetters) => (project) => {
      if (!project || !project.displayDocumentIds) {
        return []
      }
      // console.log(' 2RECALCULATE2 project.id:', project.id, 'displayDocumentIds:', project.displayDocumentIds)
      const result = []
      project.documentIds.forEach(id => {
        if (project.displayDocumentIds.includes(id)) {
          result.push(state.itemById[id])
        }
      })
      return result
    },
    documentsDataForExportByIds: (state, getters) => (ids) => {
      if (!ids) {
        return null
      }
      if (!Array.isArray(ids)) {
        ids = [ids]
      } else {
        // Only unique
        ids = new Set(ids)
      }
      const documentDataArray = []
      ids.forEach(id => {
        const documentData = _.clone(state.itemById[id])
        if (!documentData) {
          return null
        }
        // documentData.textRows = state.documentContentById[id]
        documentDataArray.push(documentData)
      })

      return {
        documents: documentDataArray,
        documentsChanges: this.changes ? this.changes.itemById : null
      }
    }
  }
})

function getEmptyDocument () {
  return {
    id: null,
    ownerId: null,
    editorIds: [],
    viewerIds: null,
    public: null,
    createdAt: null,
    updatedAt: null,

    author: null,
    name: null,
    editionName: null,
    lang: null,
    relatedDocId: null,
    projectIds: [],

    // Current state
    locked: false,
    editing: true,
    created: false, // ?
    deleted: false,

    // Content
    textRows: []
    // version: null,
    // changesApplied: null
  }
}

function sliceChanges (textRows, startIndex, shiftIndex = 0) {
  // (Use {}, not [] to be able to set up 'length' property)
  const changes = {}
  for (let i = startIndex; i < textRows.length; i++) {
    changes[i + shiftIndex] = textRows[i]
  }
  return changes
}
