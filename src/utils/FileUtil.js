'use strict'
export default class FileUtil {
  // Save

  static fileURL = null

  static generateDownloadURL (text) {
    const data = new Blob([text], {type: 'text/plain'})

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (FileUtil.fileURL !== null) {
      window.URL.revokeObjectURL(FileUtil.fileURL)
    }

    FileUtil.fileURL = window.URL.createObjectURL(data)

    // returns a URL you can use as a href
    return FileUtil.fileURL
  }

  static saveToFile (fileName, text = null) {
    console.log('saveToFile fileName:', fileName)// , 'text:', text)
    const link = document.createElement('a')
    link.setAttribute('download', fileName)
    link.href = FileUtil.generateDownloadURL(text || document.documentElement.innerHTML)
    document.body.appendChild(link)
    // console.log(link.href)

    // wait for the link to be added to the document
    link.click()
    document.body.removeChild(link)
//                window.requestAnimationFrame(function () {
//                    var event = new MouseEvent('click')
//                    link.dispatchEvent(event)
//                    document.body.removeChild(link)
//                })
  }

  // Load

  static loadFileFromInput (event, callback) {
    let file = event.target.files[0]
    if (!file) {
      return
    }
    FileUtil.loadFile(file, callback)
  }

  static loadFile (file, callback) {
    if (!file) {
      return
    }

    let reader = new FileReader()
    reader.onload = function (event) {
      let contents = event.target.result
      callback(contents)
      reader.onload = null
    }
    reader.readAsText(file)
  }

  // File name

  static addJsonExtIfNeeded (fileName) {
    return !fileName.endsWith('.json') ? fileName + '.json' : fileName
  }

  // File content

  static encodeRawText (rawText) {
    // Recognize encoding and encode to utf-8
    return rawText
  }
}
