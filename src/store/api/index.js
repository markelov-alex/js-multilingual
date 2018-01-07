import Vue from 'vue'
import VueResource from 'vue-resource'

import config from '@/config'
import resource from './resource'
// import state from './state'
// import projects from './projects'
// import documents from './documents'

// console.log('API CONFIG:', config)
Vue.use(VueResource)

Vue.http.options.root = config.apiBaseURL

// console.log('API CONFIG:', config)

/**
 * RESTful server API.
 *
 * According to scheme like here:
 * http://www.restapitutorial.com/lessons/httpmethods.html
 * If we don't need updateAll() then PATCH method could be replaced
 * with POST for partial update, like it's suggested here:
 * https://stackoverflow.com/questions/6203231/which-http-methods-match-up-to-which-crud-methods
 *
 * Everywhere in application we make calls to RESTful back-end only through
 * this object, hence here is the only place that will be affected when
 * server's API changes.
 */
export default {
  projects: resource('projects'),
  documents: resource('documents')
  // ...state,
  // // projects: Vue.resource('/resources{/id}')
  // projects,
  // documents
}
