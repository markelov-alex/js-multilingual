<template>
  <span>
    <input slot="fileName" v-model:value="saveFileName" :placeholder="inputPlaceholder" @change="errorMessage=''">

    <button slot="button" @click="saveToFile" :title="buttonTitle">{{buttonCaption}}</button>

    <label v-if="errorMessage" class="error" style="display:block; color: red">{{errorMessage}}</label>
  </span>
</template>

<script>
  import FileUtil from '@/utils/FileUtil'

  export default {
    props: {
      name: '',
      inputPlaceholder: {'default': 'Save file name'},
      buttonCaption: {'default': 'Save'},
      buttonTitle: {'default': 'Save by downloading'}
    },
    data () {
      return {
        'errorMessage': '',
        'saveFileName': ''
      }
    },
    methods: {
      saveToFile () {
        if (!this.saveFileName && this.name) {
          this.saveFileName = this.name
        }
        if (this.saveFileName) {
          this.errorMessage = ''
          FileUtil.saveToFile(FileUtil.addHtmlExtIfNeeded(this.saveFileName))
        } else {
          this.errorMessage = 'Please enter some file name'
        }
      }
    }
  }
</script>

<style>

</style>
