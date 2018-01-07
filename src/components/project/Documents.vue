<template>
  <div class="container-fluid">
    <!--Text Parse/Load/Save panels-->
    <div class="row">
      <div v-for="(document, columnIndex) in displayDocuments"
          :class="classesByColumnIndex[columnIndex]" style="halign: center;" key>
        <h3>{{(document && document.name || '') + (document && document.author ?
              authorDelimeter(document && document.lang) + document.author : '')}}</h3>
        <h4>{{document && document.editionName}}</h4>
      </div>
    </div>
    <!--Text Parse/Load/Save panels-->
    <div class="row">
      <div v-for="(document, columnIndex) in displayDocuments"
          :class="classesByColumnIndex[columnIndex]" style="halign: center;" key>
        <ManageDocument :project="project"
                        :document="document" :columnIndex="columnIndex">
        </ManageDocument>
      </div>
    </div>
    <!--Parsed text-->
    <div v-for="rowIndex in maxRowCount"
        class="row" key>
      <div v-for="(document, columnIndex) in displayDocuments"
          :class="classesByColumnIndex[columnIndex]" key>
        <Paragraph :document="document"
                   :rowIndex="rowIndex - 1">
        </Paragraph>
      </div>
    </div>
    <!--Text Parse/Load/Save panels-->
    <div class="row">
      <div v-for="(document, columnIndex) in displayDocuments"
          :class="classesByColumnIndex[columnIndex]" style="halign: center;" key>
        <LoadAndParse v-if="document && document.editing"
                      :document="document" parsingEnabled="true">
        </LoadAndParse>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import LangUtil from '@/utils/LangUtil'
  import ManageDocument from './document/ManageDocument.vue'
  import LoadAndParse from './document/LoadAndParse.vue'
  import Paragraph from './document/Paragraph.vue'

  export default {
    components: {ManageDocument, Paragraph, LoadAndParse},
    props: ['project'],
    data () {
      return {
      }
    },
    computed: {
      ...mapGetters('documents', ['displayDocumentsForProject']),
      displayDocuments () {
        return this.displayDocumentsForProject(this.project)
      },
      classesByColumnIndex () {
        const count = this.displayDocuments.length
        const result = []
        // 0-th class prefix for 1 item to be displayed, 1-st - for 2 items, ...
        const classPrefixes = ['col-', 'col-sm-', 'col-md-', 'col-lg-', 'col-xl-']
        const maxCount = 12
        for (let i = 0; i < count; i++) {
          for (let j = i; j < count; j++) {
            if (j > maxCount) {
              continue
            }
            const curCount = Math.min(j + 1, maxCount)
            const size = Math.floor(maxCount / curCount)
            const className = classPrefixes[Math.min(classPrefixes.length - 1, j)] + size
            result[i] = (result[i] ? result[i] + ' ' : '') + className
          }
        }
        return result
      },
      maxRowCount () {
        if (this.displayDocuments) {
          let lengths = this.displayDocuments.map(document => {
            const content = document ? document.textRows : null
            return content ? content.length : 0
          })
          return lengths.length ? Math.max.apply(this, lengths) : 0
        }
        return 0
      },
      isEditMode () {
        return this.project.isEditMode
      }
    },
    methods: {
      authorDelimeter (lang) {
        return LangUtil.authorDelimeter(lang)
      }
    }
  }
</script>

<style scoped>
  /*.row > div {
    border: crimson dashed 1px;
  }*/
</style>
