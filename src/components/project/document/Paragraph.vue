<template>
  <div class="text-center">
    <textarea ref="editTextArea" v-if="document && document.editing && isEditingText"
              v-model="value" @keyup.ctrl.enter="switchEditing(false)"
              title="Press Ctrl+Enter to commit"></textarea>
    <pre v-else class="text-left">{{value}}</pre>
    <!-- (There is a problem when setting repsonse back - first lines duplicated) -->
    <!--<span v-else contenteditable="true" @blur="onContentEditableBlur">{{value}}</span>-->

    <div v-if="document && document.editing">
      <button type="button" class="btn btn-outline-secondary btn-sm"
              @click="switchEditing" title="Edit text">edit</button>

      <button type="button" class="btn btn-outline-secondary btn-sm"
              v-show="rowIndex > 0"
              @click="moveRowUp({document, rowIndex})" title="Move up">↑</button>
      <button type="button" class="btn btn-outline-secondary btn-sm"
              v-show="textRows && rowIndex < textRows.length - 1"
              @click="moveRowDown({document, rowIndex})" title="Move down">↓</button>

      <button type="button" class="btn btn-outline-secondary btn-sm"
              @click="removeRow({document, rowIndex})" title="Delete">x</button>
      <button type="button" class="btn btn-outline-secondary btn-sm"
              @click="rowIndex ? joinRowWithPrevious({document, rowIndex}) : createRows({document, rowIndex})"
              :title="rowIndex ? 'Join with previous' : 'Create new before'"
              :style="rowIndex ? 'color: grey' : ''">▲</button>
      <button type="button" class="btn btn-outline-secondary btn-sm"
              @click="createRowAfterOrSplitSelection"
              title="Create new after | Split selection">▼</button>
    </div>
  </div>
</template>

<script>
  // ↑↓˄˅▲▼  x ✕&#10005; ×&#215;&times; ⨯&#10799; ✖&#10006;
  import { mapActions } from 'vuex'
  import SelectionUtil from '@/utils/SelectionUtil'

  export default {
    props: [
      'document',
      'rowIndex'
    ],
    data () {
      return {
        'isEditingText': false,
        'prevValue': null
      }
    },
    computed: {
      value: {
        get () {
          if (!this.textRows) {
            return ''
          }

//          // Turn off edit mode if value was changed externally (by moving rows or switching columns, for example)
//          if (this.isEditingText && this.prevValue !== this.textRows[this.rowIndex]) {
//            // console.log(this.prevValue, this.textRows[this.rowIndex])
//            this.isEditingText = false
//          }
//          this.prevValue = this.textRows[this.rowIndex]

          return this.textRows[this.rowIndex]
        },
        set (value) {
          this.setRowValue({
            document: this.document, textRows: this.textRows, rowIndex: this.rowIndex, value
          })
        }
      },
      textRows () {
//        return this.$store.state.documents.documentContentById[this.document.id]
        return this.document && this.document.textRows
      }
    },
    methods: {
      ...mapActions('documents', ['setRowValue', 'moveRowUp', 'moveRowDown', 'removeRow',
        'joinRowWithPrevious', 'createRows']),

      onContentEditableBlur (event) {
        this.value = event.target.innerText
      },
      switchEditing (turnOn = null) {
        // console.log('P switchEditing', turnOn)
        this.isEditingText = turnOn instanceof Event ? !this.isEditingText : turnOn
        if (this.isEditingText) {
          this.$nextTick(function () {
            this.$refs.editTextArea.focus()
          })
        }
      },

      createRowAfterOrSplitSelection () {
        if (!this.splitSelection()) {
          // Create empty row after rowIndex
          const data = {
            document: this.document,
            rowIndex: this.rowIndex,
            values: [this.document.textRows[this.rowIndex], ''],
            removeCount: 1
          }
          this.createRows(data)
        }
      },
      splitSelection () {
        let currentText = String(this.textRows[this.rowIndex])
        let selection = window.document.getSelection()
        let startNode = selection.anchorNode
        let endNode = selection.focusNode
        // (All properties to get content: startNode.data, nodeValue, textContent, wholeText)
        if (!startNode || startNode.data !== currentText) {
          // Skip if there is no selection or selection is in different node
          return false
        }

        let values = [currentText.substring(0, selection.anchorOffset)]
        if (startNode !== endNode) {
          values.push(currentText.substring(selection.anchorOffset))
        } else {
          values.push(currentText.substring(selection.anchorOffset, selection.focusOffset))
          // (Note: -2 - to skip '\n\r')
          if (selection.focusOffset < currentText.length - 2) {
            values.push(currentText.substring(selection.focusOffset))
            console.log('SPLIT', selection, selection.anchorOffset, selection.focusOffset, currentText.length - 1, values)
          }
        }

        const data = {
          document: this.document,
          rowIndex: this.rowIndex,
          values: values,
          removeCount: 1
        }
        this.createRows(data)
        // Avoid splitting not intended text on clicking the same button
        // just because previous selection remains
        SelectionUtil.clearSelection()
        return true
      }
    }
  }
</script>

<style scoped>
  textarea {
    width: 100%;
    height: 100%;
  }
  pre {
    white-space: pre-wrap;
    /*horiz-align: left;*/
  }
</style>
