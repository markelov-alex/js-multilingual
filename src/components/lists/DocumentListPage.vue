<template>
  <div>
    <HeaderPart></HeaderPart>
    <DocumentList></DocumentList>
    <FooterPart></FooterPart>
  </div>
</template>

<script>
//  import { mapActions } from 'vuex'

  import HeaderPart from '@/components/common/HeaderPart'
  import FooterPart from '@/components/common/FooterPart'
  import DocumentList from './DocumentList'

  export default {
    components: {HeaderPart, FooterPart, DocumentList},
    created () {
      this.getDocuments()
    },
    methods: {
      getDocuments () {
        this.$store.dispatch('documents/getItems')
      }
    }
  }
</script>

<style>

</style>
