<template>
  <table class="table">
    <tbody>
    <tr>
      <th>N</th>
      <th>Author</th>
      <th>Name</th>
      <th>Edition</th>
      <th>Language</th>
      <th>Owner id</th>
      <th>Related to</th>
      <th>In projects count</th>
    </tr>
    <tr v-for="(document, key, index) in documentById">
      <td>{{index + 1}}</td>
      <!--<td><router-link :to="'/document/' + document.id">{{document.name}}</router-link></td>-->
      <td>{{document.authorLastName + (document.authorFirstName ? ', ' + document.authorFirstName : '')}}</td>
      <td>{{document.name}}</td>
      <td>{{document.editionName}}</td>
      <td>{{document.lang}}</td>
      <td>{{document.ownerId}}</td>
      <!--<td><router-link :to="document.relatedDocId ? '/document/' + document.relatedDocId : ''"
        >{{getRelatedDocumentNameFor(document)}}</router-link>
      </td>-->
      <td>{{getRelatedDocumentNameFor(document)}}</td>
      <td>{{document.projectIds.length}}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    components: {},
    computed: {
      ...mapState({
        documentById: state => state.documents.itemById
      })
    },
    methods: {
      getRelatedDocumentNameFor (document) {
        if (!document) {
          return ''
        }
        let related = this.documentById[document.relatedDocId]
        return related ? related.name : ''
      }
    }
  }
</script>

<style>

</style>
