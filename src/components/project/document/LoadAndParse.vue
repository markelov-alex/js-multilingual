<template>
  <span>
    <!-- To define custom label we hide file input and use another button instead -->
    <button type="button" class="btn btn-outline-primary btn-sm"
            @click="$refs.fileInput.click()"
            title="Load json data or new text file">Load</button>
    <input ref="fileInput" :rawText="rawText" :accept="acceptFileTypes" @change="loadFile"
           type="file" style="display:none">
    <label v-if="errorMessage"
           class="error" style="display:block; color: red">{{errorMessage}}</label>

    <!--
    If you set parsingEnabled="true" the load button will
    load non-json files for parsing
    -->
    <!--<Parse v-if="parsingEnabled" ref="parse"
           :document="document" :rawText="rawText">
    </Parse>-->

    <textarea class="parse-textarea" v-model:value="rawText"
              placeholder="Load or copy some text from clipboard and press Parse..."></textarea>
    <br>
    <label title="RegExp for JavaScript's String.split(). Embrace in parenthesis (...) the part you want to keep in text">
      Line separator:
      <input type="text" v-model="separator" list="separatorList"
      placeholder="RegExp pattern...">
    </label>
    <datalist id="separatorList">
      <option v-for="sep in lineSeparatorList" :value="sep.value">{{sep.name}}</option>
    </datalist>
    <br>
    <label>
      <input type="checkbox" v-model="skipEmpty">
      Skip empty lines
    </label>
    <br>
    <label>
      <input type="checkbox" v-model="trimSpacesAtStart">
      Trim spaces at start for each line
    </label>
    <br>
    <button type="button" class="btn btn-outline-primary btn-sm"
            @click="parse">Parse</button>
  </span>
</template>

<script>
  import FileUtil from '@/utils/FileUtil'
  import Parser from '@/utils/Parser'

  export default {
    components: {},
    props: ['document', 'parsingEnabled', 'loadJsonOnly'],
    data () {
      return {
        skipEmpty: false,
        trimSpacesAtStart: false,
        separator: '\n',
        errorMessage: '',
        rawText: '',
        lineSeparatorList: [
          {value: '\\n', name: 'New line'},
          {value: '\\n\\s?(\\n)', name: 'Empty line'},
          {value: '\\n\\s*(\\n)', name: 'Empty lines'},
          {value: '\\n([A-Z\\s]+\\n)', name: 'UPPER CASE LINE'}
        ]
      }
    },
    computed: {
      acceptFileTypes () {
        return this.loadJsonOnly ? '.json' : ''
      }
    },
    methods: {
      loadFile (event) {
        let file = event.target.files[0]
        FileUtil.loadFile(file, (data) => { this.rawText = data })
      },
      parse () {
        if (!this.document) {
          return
        }
        if (!this.rawText) {
          console.warn('Nothing to parse.')
          return
        }
        const content = this.document.textRows
        if (content && content.length && !confirm('This will replace current content! Are you sure?')) {
          return
        }
        let options = {
          skipEmpty: this.skipEmpty,
          trimSpacesAtStart: this.trimSpacesAtStart,
          separator: new RegExp(this.separator)
        }
        let textRows = Parser.parse(this.rawText, options)
        let documentData = {id: this.document.id, textRows}
        // console.log('Parse', documentData)
        this.$store.dispatch('documents/update', documentData)
      }
    }
  }
</script>

<style>
  .parse-textarea {
    width: 100%;
    height: 200px;
  }
</style>
