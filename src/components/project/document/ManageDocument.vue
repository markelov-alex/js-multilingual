<template>
  <span>
    <button type="button" class="btn btn-outline-primary btn-sm"
            v-if="userCanEdit && !isSaveable" @click="toggleEditing(document)">Edit</button>
    <button type="button" class="btn btn-outline-primary btn-sm"
            v-if="userCanEdit && isSaveable"
            @click="save(document)">Save</button>
    <button type="button" class="btn btn-outline-primary btn-sm"
            v-if="userCanEdit && isSaveable"
            @click="cancel(document)">Cancel</button>
    <!--
    <button onclick="getElementById('importDocumentFileInput' + columnIndex).click()">Import</button>
    <input type="file" :id="'importDocumentFileInput' + columnIndex" @change="importDocument">
    -->
    <button type="button" class="btn btn-outline-primary btn-sm"
            @click="exportToFile(document)">Export</button>
    <button type="button" class="btn btn-outline-primary btn-sm"
            onclick="getElementById('importDocumentFileInput').click()">Import</button>
    <input type="file" id="importDocumentFileInput" @change="importDocument">
    <button type="button" class="btn btn-outline-primary btn-sm"
            v-if="project.editing" @click="duplicate(document)">Duplicate</button>
    <button type="button" class="btn btn-outline-primary btn-sm"
            v-if="userCanEdit" @click="deleteItem(document)"
            title="Unrecoverable document deleting">Delete</button>
    <button type="button" class="btn btn-outline-primary btn-sm"
            v-if="project.editing" @click="dettachDocument({project, document})"
            title="Remove document from project">x</button>

    <div v-if="editing">
      <br>
      <label>Author:
        <input v-model:value="authorFirstName" placeholder="Author first name">
        <input v-model:value="authorLastName" placeholder="Author last name">
      </label>
      <br>
      <label>Name:
        <input v-model:value="documentName" placeholder="Document name">
      </label>
      <br>
      <label>Edition:
        <input v-model:value="editionName" placeholder="Edition name">
      </label>
      <select v-model:value="lang" placeholder="Language">
        <option disabled>Language...</option>
        <option v-for="lang in langs" :value="lang.value">{{lang.text}}</option>
      </select>
    </div>
  </span>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  //  import _ from 'lodash'

  import langs from '@/utils/langs'
  import CheckUtil from '@/utils/CheckUtil'

  export default {
    props: ['project', 'document', 'columnIndex'],
    data () {
      return {
      }
    },
    computed: {
      ...mapState(['isDesktopMode']),
      authorFirstName: {
        get () { return this.document && this.document.authorFirstName },
        set (value) { this.update({id: this.document.id, authorFirstName: value}) }
      },
      authorLastName: {
        get () { return this.document && this.document.authorLastName },
        set (value) { this.update({id: this.document.id, authorLastName: value}) }
      },
      documentName: {
        get () { return this.document && this.document.name },
        set (value) { this.update({id: this.document.id, name: value}) }
      },
      editionName: {
        get () { return this.document && this.document.editionName },
        set (value) { this.update({id: this.document.id, editionName: value}) }
      },
      lang: {
        get () { return this.document && this.document.lang },
        set (value) { this.update({id: this.document.id, lang: value}) }
      },
      langs () {
        return langs
      },
      user () {
        return this.$store.getters.currentUser
      },
      userCanEdit () {
        return this.project.editing && // !this.document.locked &&
               CheckUtil.userCanEditDocument(this.user, this.document)
      },
      isSaveable () {
        return !this.isDesktopMode && this.document && this.document.editing
      },
      editing () {
        return this.project && this.project.editing && this.document && this.document.editing
      }
    },
    methods: {
      ...mapActions('projects', ['dettachDocument']),
      ...mapActions('documents', ['duplicate', 'toggleEditing', 'exportToFile',
        'save', 'cancel', 'update']),
      deleteItem (document) {
        this.$store.dispatch('documents/delete', document)
      },
      /**
       * Note: all import buttons use same action.
       * @param event
       */
      importDocument (event) {
        let file = event.target.files[0]
        this.$store.dispatch('importFile', file)
      }
    },
    watch: {
      userCanEdit (value) {
        if (!value && this.document.editing) {
          this.toggleEditing(this.document)
        }
      }
    },
    getters: {
//      ...mapGetters(['userCanEdit'])
    }
  }
</script>

<style>

</style>
