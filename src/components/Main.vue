<template>
  <span>
    <HeaderPart></HeaderPart>
    <h1>Welcome!</h1>
    <FooterPart></FooterPart>
  </span>
</template>

<script>
  import HeaderPart from '@/components/common/HeaderPart'
  import FooterPart from '@/components/common/FooterPart'

  export default {
    components: {HeaderPart, FooterPart}
  }
</script>

<style>

</style>
