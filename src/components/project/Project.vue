<template>
  <div>
    <HeaderPart></HeaderPart>
    <!--<ProjectList></ProjectList>-->

    <!-- /project/new -->
    <CreateProject v-if="isCreateNewMode">
    </CreateProject>
    <!-- /project/:id-->
    <div v-else>
      <ManageProject :project="currentProject"></ManageProject>
      <br>
      <label v-if="errorMessage"
             class="error" style="display:block; color: red">{{errorMessage}}</label>
      <br>
      <Documents :project="currentProject"></Documents>
    </div>

    <FooterPart></FooterPart>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import HeaderPart from '@/components/common/HeaderPart'
  import FooterPart from '@/components/common/FooterPart'
  import ProjectList from '@/components/lists/ProjectList'
  import CreateProject from './CreateProject.vue'
  import ManageProject from './ManageProject.vue'
  import Documents from './Documents.vue'

  export default {
    components: {
      HeaderPart, FooterPart, ProjectList, CreateProject, ManageProject, Documents
    },
    data () {
      return {
        isCreateNewMode: false,
        isEditMode: false
//        errorMessage: ''
      }
    },
    computed: {
      errorMessage () {
        return this.$store.state.globalErrorMessage
      },
      ...mapGetters('projects', ['currentProject'])
    },
    methods: {
      getProject (id) {
        return this.$store.dispatch('projects/getItem', id)
      },
      // Used by routing hooks
      onRouteChange (to) {
        let projectId = to.params.id
        let user = this.$store.getters.currentUser
        this.isCreateNewMode = projectId === 'new'
        // console.log('R onRouteChange -> switchProject? projectId:', projectId, 'this.id:', this.id,
        //   'isCreateNewMode:', this.isCreateNewMode, 'to.params:', to.params)
        if (!this.isCreateNewMode && projectId) {
          this.$store.commit('switchProject', {user, projectId})
          this.getProject(projectId)
        }
      }
    },
    watch: {},
    beforeRouteEnter (to, from, next) {
      // console.log('R beforeRouteEnter', to, from)
      // Needed to set up isCreateNewMode if came to 'project/:id' from outside
      // (not from some 'project/:id')
      next(vm => { vm.onRouteChange(to) })
    },
    beforeRouteUpdate (to, from, next) {
      // console.log('R beforeRouteUPDATE', to, from, this.id)
      // Needed to set up isCreateNewMode and/or currentProjectId
      // if came to 'project/:id' from another 'project/:id'
      this.onRouteChange(to)
      next()
    }
    // beforeRouteLeave (to, from, next) {
    //   next(confirm('Are you sure to leave without saving?'))
    // }
  }
</script>

<style scoped>

</style>
