<template>
  <div>
    <h1>{{(projectName || 'Project') + (authorName ? authorDelimeter + authorName : '')}}</h1>

    <button type="button" class="btn btn-outline-primary btn-sm"
            v-if="userCanEdit && !isSaveable"
            @click="toggleEditing(project)">Edit</button>
    <button type="button" class="btn btn-outline-primary btn-sm"
            v-if="userCanEdit && isSaveable"
            @click="save(project)">Save</button>
    <button type="button" class="btn btn-outline-primary btn-sm"
            v-if="userCanEdit && isSaveable"
            @click="cancel(project)">Cancel</button>
    <button type="button" class="btn btn-outline-primary btn-sm"
            onclick="getElementById('importProjectFileInput').click()">Import</button>
    <input type="file" id="importProjectFileInput" @change="importItem">
    <button type="button" class="btn btn-outline-primary btn-sm"
            @click="exportToFile(project)">Export</button>
    <button type="button" class="btn btn-outline-primary btn-sm"
            @click="duplicateItem">Duplicate</button>
    <button type="button" class="btn btn-outline-primary btn-sm"
            v-if="userCanEdit" @click="deleteItem">Delete</button>

    <div v-if="editing">
      <br>
      <label>Author:
        <input v-if="editing" v-model:value="authorFirstName" placeholder="Author first name">
        <input v-if="editing" v-model:value="authorLastName" placeholder="Author last name">
      </label>
      <br>
      <label>Name:
        <input v-model:value="projectName" placeholder="Project name">
      </label>
      <select v-model:value="lang" placeholder="Text language">
        <option disabled>Text language...</option>
        <option v-for="lang in langs" :value="lang.value">{{lang.text}}</option>
      </select>
    </div>

    <br>
    <div>
      Document:
      <button type="button" class="btn btn-outline-primary btn-sm"
              @click="createDocument">Create</button>
      <span>
        <span class="mx-3" v-for="(document, key) in documentsForProject(project)">
          <input :id="'doc_checkbox' + key" type="checkbox"
                 v-model="displayDocumentIds" :value="document && document.id">
          <!--@change="toggleShowDocument({project, document})">-->
          <label :for="'doc_checkbox' + key" title="Show/hide document">{{
            document && ((document.editionName || document.name) +
                         (document.lang ? ' (' + document.lang + ')' : ''))}}</label>
        </span>
     </span>
    </div>
  </div>

</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex'
  // import _ from 'lodash'

  import LangUtil from '@/utils/LangUtil'
  import langs from '@/utils/langs'

  export default {
    data () {
      return {}// displayDocumentIds: []}
    },
    props: ['project'],
    computed: {
      ...mapState(['isDesktopMode']),
      ...mapGetters('projects', ['userCanEdit', 'isDocumentShownIn']),
      ...mapGetters('documents', ['documentsForProject']),
      authorName () {
        return this.authorFirstName + ' ' + this.authorLastName
      },
      authorFirstName: {
        get () { return this.project && this.project.authorFirstName },
        set (value) { this.update({id: this.project.id, authorFirstName: value}) }
      },
      authorLastName: {
        get () { return this.project && this.project.authorLastName },
        set (value) { this.update({id: this.project.id, authorLastName: value}) }
      },
      projectName: {
        get () { return this.project && this.project.name },
        set (value) { this.update({id: this.project.id, name: value}) }
      },
      lang: {
        get () { return this.project && this.project.lang },
        set (value) { this.update({id: this.project.id, lang: value}) }
      },
      langs () {
        return langs
      },
      displayDocumentIds: {
        get () { return this.project && this.project.displayDocumentIds },
        set (value) {
          if (value) {
            this.update({id: this.project.id, displayDocumentIds: value})
          }
        }
      },
      authorDelimeter () {
        return LangUtil.authorDelimeter(this.project && this.project.lang)
      },
      isSaveable () {
        return !this.isDesktopMode && this.project && this.project.editing
      },
      editing () {
        return this.project && this.project.editing
      }
    },
    methods: {
      ...mapActions('projects', ['toggleShowDocument', 'toggleEditing',
        'exportToFile', 'save', 'cancel', 'update']),

      // todo remove, leave only one import link
      importItem (event) {
        let file = event.target.files[0]
        this.$store.dispatch('importFile', file)
      },
      duplicateItem () {
        this.$store.dispatch('projects/duplicate', this.project)
          .then(response => {
            this.$router.push({name: 'project', params: {id: response.body.id}})//  || this.project.id
            return response
          })
      },
      deleteItem () {
        this.$store.dispatch('projects/delete', this.project)
          .then(response => {
            this.$router.push({name: 'project-list'})
            return response
          })
      },

      createDocument () {
        this.$store.dispatch('documents/create')
      }
    }
  }
</script>

<style>

</style>
