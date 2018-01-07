<template>
  <table class="table">
    <tbody>
      <tr>
        <th>N</th>
        <th>Author</th>
        <th>Name</th>
        <th>Language</th>
        <th>Owner id</th>
        <th>Documents count</th>
      </tr>
      <tr v-for="(project, key, index) in itemById">
        <td>{{index + 1}}</td>
        <td>{{project.authorLastName + (project.authorFirstName ? ', ' + project.authorFirstName : '')}}</td>
        <td><router-link :to="'/project/' + project.id">{{project.name || '(no name)'}}</router-link></td>
        <td>{{project.lang}}</td>
        <td>{{project.ownerId}}</td>
        <td>{{project.documentIds ? project.documentIds.length : 0}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    components: {},
    computed: {
      // ...mapState('projects', ['itemById']) // for namespaced
      ...mapState({
        itemById: state => state.projects.itemById
      })
    }
  }
</script>

<style>

</style>
