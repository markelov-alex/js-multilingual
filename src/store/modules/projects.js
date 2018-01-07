import _ from 'lodash'
import dateFormat from 'dateformat'

import createItem from '../mixins/item'
import CheckUtil from '@/utils/CheckUtil'
import api from '../api'

const itemMixin = createItem(api.projects, getEmptyProject, 'project')

export default _.merge({}, itemMixin, {
  state: {},
  mutations: {},
  actions: {

    // Read

    getItem (context, itemOrId) {
      return itemMixin.actions.getItem(context, itemOrId)
        .then(response => {
          // console.log('on getitems response:', response)
          if (response.body.documentIds) {
            // console.log('on getitems -> getDocuments:', response.body.documentIds)
            return context.dispatch('documents/getItems', response.body.documentIds, {root: true})
          }
          return response
        })
    },

    // Export

    exportAllMyToFile (context, payload) {
      const myProjectIds = context.getters.myProjectIds
      const data = context.getters.itemsDataForExportByIds(myProjectIds)

      let fileName = payload ? payload.fileName : ''
      if (!fileName) {
        // fileName = 'export_multilingual_' + DateUtil.dateTimeString()
        fileName = 'export_myprojects_' + dateFormat(new Date(), 'yyyymmdd_HHMMss')
      }

      context.dispatch('exportData', {data, fileName}, {root: true})
    },

    // Editing

    attachDocument (context, {project, document}) {
      // console.log('#attachDocument', project.id, document.id, project.documentIds, document.projectIds)
      // documentIds
      const documentIds = project.documentIds.slice()
      if (documentIds.indexOf(document.id) === -1) {
        documentIds.push(document.id)
        // console.log('attachDocument documentIds:', documentIds)
        context.dispatch('update', {id: project.id, documentIds})
      }

      // projectIds
      const projectIds = document.projectIds.slice() || []
      if (projectIds.indexOf(project.id) === -1) {
        projectIds.push(project.id)
        context.dispatch('documents/update', {id: document.id, projectIds}, {root: true})
      }
      // console.log('  #attachDocument', documentIds, projectIds)
      // console.log('   #attachDocument', project.documentIds, document.projectIds)
    },
    dettachDocument (context, {project, document}) {
      // console.log('#dettachDocument', project.id, document.id, project.documentIds, document.projectIds)
      // documentIds
      const documentIds = project.documentIds.slice()
      let index = documentIds.indexOf(document.id)
      if (index !== -1) {
        documentIds.splice(index, 1)
      }

      // displayDocumentIds
      const displayDocumentIds = project.displayDocumentIds.slice()
      index = displayDocumentIds.indexOf(document.id)
      if (index !== -1) {
        displayDocumentIds.splice(index, 1)
      }
      context.dispatch('update', {id: project.id, documentIds, displayDocumentIds})

      // projectIds
      const projectIds = document.projectIds.slice() || []
      index = projectIds.indexOf(project.id)
      if (index !== -1) {
        projectIds.splice(index, 1)
        context.dispatch('documents/update', {id: document.id, projectIds}, {root: true})
      }
      // console.log('  #dettachDocument', documentIds, projectIds)
      // console.log('   #dettachDocument', project.documentIds, document.projectIds)
    },
    toggleShowDocument (context, {project, document}) {
      const isShown = context.getters.isDocumentShownIn(project, document)
      context.dispatch(isShown ? 'hideDocument' : 'showDocument', {project, document})
    },
    showDocument (context, {project, document, columnIndex}) {
      // displayDocumentIds
      const displayDocumentIds = project.displayDocumentIds.slice()
      const index = displayDocumentIds.indexOf(document.id)
      if (columnIndex === undefined) {
        if (index === -1) {
          // Just append to the end
          displayDocumentIds.push(document.id)
        }
      } else if (index !== columnIndex) {
        // Add or move to specified position
        if (index !== -1) {
          displayDocumentIds.splice(index, 1)
        }
        displayDocumentIds.splice(columnIndex, 0, document.id)
      }
      context.dispatch('update', {id: project.id, displayDocumentIds})
    },
    hideDocument (context, {project, document, columnIndex}) {
      // displayDocumentIds
      const displayDocumentIds = project.displayDocumentIds.slice()
      if (columnIndex === undefined) {
        const index = displayDocumentIds.indexOf(document.id)
        if (index !== -1) {
          displayDocumentIds.splice(index, 1)
        }
      } else if (columnIndex < displayDocumentIds.length) {
        displayDocumentIds.splice(columnIndex, 1)
      }
      context.dispatch('update', {id: project.id, displayDocumentIds})
    }
  },
  getters: {
    /**
     * List of projects for export.
     * @param state
     * @param getters
     * @returns {Array}
     */
    myProjectIds (state, getters, rootState, rootGetters) {
      const userId = rootGetters.currentUser.id
      const projectIds = []
      for (let project of Object.values(state.itemById)) {
        if (project.ownerId === userId ||
            project.editorIds.includes(userId)// ||
        // project.likedIds.includes(userId)
        ) {
          projectIds.push(project.id)
        }
      }
      // todo test recalculation on changing editorIds
      // console.log('(recalculate my projectIds:', projectIds, ')')
      return projectIds
    },
    currentProject (state, getters, rootState, rootGetters) {
      const currentProjectId = rootGetters.currentUser.currentProjectId
      return rootGetters.currentUser ? state.itemById[currentProjectId] : null
    },
    userCanEdit (state, getters, rootState, rootGetters) {
      // console.log('Project.userCanEdit', getters['currentProject'],
      //   CheckUtil.userCanEditItem(rootGetters.currentUser, getters['currentProject']))
      return CheckUtil.userCanEditProject(rootGetters.currentUser, getters['currentProject'])
    },
    isDocumentShownIn: (state, getters, rootState, rootGetters) => (project, document) => {
      if (!project || !document) {
        return false
      }
      const index = project.displayDocumentIds.indexOf(document.id)
      return index !== -1
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
      const documentIds = []
      ids.forEach(id => {
        const itemData = state.itemById[id]
        itemDataArray.push(itemData)
        documentIds.push(...itemData.documentIds)
      })
      const itemsDataForExport = {
        projects: itemDataArray,
        projectsChanges: this.changes
      }

      const documentsDataForExport = rootGetters['documents/documentsDataForExportByIds'](documentIds)
      _.merge(itemsDataForExport, documentsDataForExport)
      return itemsDataForExport
    }
  }
})

function getEmptyProject () {
  return {
    id: null,
    ownerId: null,
    editorIds: [],
    viewerIds: [],
    public: null,
    createdAt: null,
    updatedAt: null,

    author: null,
    name: null,
    lang: null,
    saveFileName: null,
    documentIds: [],
    displayDocumentIds: [],

    locked: false,
    editing: true,
    created: false, // ?
    deleted: false
  }
}
