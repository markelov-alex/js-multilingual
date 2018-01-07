import Vue from 'vue'
import Router from 'vue-router'

import Main from '@/components/Main.vue'
import ProjectListPage from '@/components/lists/ProjectListPage.vue'
import DocumentListPage from '@/components/lists/DocumentListPage.vue'
import Project from '@/components/project/Project.vue'
import NotFound from '@/components/common/NotFound.vue'

Vue.use(Router)

/**
 * External API for users.
 *
 * Everywhere in application we use routes by their names,
 * hence all external URLs can be defined in one place -- here.
 */
let router = new Router({
  mode: 'history',
  routes: [
    {
      name: 'root',
      path: '/',
      component: Main
    },
    {
      name: 'project-list',
      path: '/projects',
      component: ProjectListPage
    },
    {
      name: 'document-list',
      path: '/documents',
      component: DocumentListPage
    },
    {
      name: 'project',
      path: '/project/:id',
      component: Project
    },
    // {
    //   path: '/document/:id',
    //   name: 'Document',
    //   component: Document
    // },
    {
      name: 'not-found',
      path: '*',
      component: NotFound
    }
  ]
})

export default router
