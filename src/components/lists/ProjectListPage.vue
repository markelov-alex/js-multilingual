<template>
  <div>
    <HeaderPart></HeaderPart>
    <ProjectList></ProjectList>
    <FooterPart></FooterPart>
  </div>
</template>

<script>
//  import { mapActions } from 'vuex'

  import HeaderPart from '@/components/common/HeaderPart'
  import FooterPart from '@/components/common/FooterPart'
  import ProjectList from './ProjectList'

  export default {
    components: {HeaderPart, FooterPart, ProjectList},
    created () {
      this.getProjects()
    },
    methods: {
      getProjects () {
        this.$store.dispatch('projects/getItems')
      }
//      ...mapActions(['projects/getItems'])
    }
  }
</script>

<style>

</style>
