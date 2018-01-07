<template>
  <div style="display:inline-block; *display:inline;">
    <span><h1><router-link :to="{name: 'root'}">Multilingual</router-link></h1></span>
    <span><router-link :to="{name: 'project', params: {id: 'new'}}">New project</router-link></span>
    <span @click="getProjects()"><router-link :to="{name: 'project-list'}">Projects</router-link></span>
    <span @click="getDocuments()"><router-link :to="{name: 'document-list'}">Documents</router-link></span>
    <span>
      <a href="#"><label for="importAllFileInput">Import</label></a>
      <input type="file" id="importAllFileInput" @change="importAny">
    </span>
    <span><a href="#" @click.prevent="exportAll">Export All</a></span>
    <span><router-link :to="$route.path + '?_=' + (new Date).getTime()">Refresh</router-link></span>
    <br>
    <SwitchMode></SwitchMode>
    <br>
    <pre style="color: darkred">{{globalErrorMessage}}</pre>
    <br>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import SwitchMode from './SwitchMode'

  export default {
    computed: {
      ...mapState(['globalErrorMessage'])
    },
    components: {
      SwitchMode
    },
    methods: {
      getProjects () {
        this.$store.dispatch('projects/getItems')
      },
      getDocuments () {
        this.$store.dispatch('documents/getItems')
      },
//      ...mapActions(['', '']),
      importAny (event) {
        let file = event.target.files[0]
        this.$store.dispatch('importFile', file)
      },
      exportAll () {
        this.$store.dispatch('exportStateToFile')
        this.$store.dispatch('projects/exportAllMyToFile')
      }
    }
  }
</script>

<style>
  input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    filter: alpha(opacity=0);
    opacity: 0;
    margin: 0;
    padding: 0;
  }

  a > label {
    /* inherit the hand cursor from the a tag */
    cursor: inherit;
  }
</style>
