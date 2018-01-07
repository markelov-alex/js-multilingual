<template>
  <div>
    <input placeholder="Project name" v-model:value="projectName">
    <button @click="createProject">Create</button>
  </div>
</template>

<script>
  export default {
    components: {},
    data () {
      return {
        projectName: 'Project'
      }
    },
    methods: {
      createProject () {
        if (!this.projectName) {
          alert('Cannot create project with empty name!')
          return
        }
        this.$store.dispatch('projects/create', {name: this.projectName})
          .then(response => {
            // console.log('###on createProject', response.ok, response)
            this.$router.push({name: 'project', params: {id: response.body.id}})
            return response
          })
      }
    }
  }
</script>

<style>

</style>
