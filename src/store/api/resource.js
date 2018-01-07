import Vue from 'vue'
// import _ from 'lodash'

import config from '@/config'

export default function (path) {
  return {
    getAll (ids = null, full = false) {
      const params = {}// ids || full ? {} : null
      if (ids) {
        params.ids = ids
      }
      if (full) {
        params.full = full
      }
      console.log('API ' + path + '.getAll', params)
      return Vue.http.get(path, params)
    },
    // Update/Replace
    // saveAll (fullData) {
    //   return Vue.http.put(path, fullData)
    // },
    // Update/Modify
    updateAll (partialData) {
      console.log('API ' + path + '.updateAll', partialData)
      return Vue.http.patch(path, partialData)
    },
    // deleteAll () {
    //   return Vue.http.delete(path)
    // },

    create (initialData) {
      // if (initialData.id) {
      //   initialData.tempId = initialData.id
      //   delete initialData.id
      // }
      console.log('API ' + path + '.create', initialData)
      return Vue.http.post(path, initialData)
        // .then(response => {
        //   response.body.created = true
        //   return response
        // })
    },
    get (dataOrId, full = false) {
      let id = typeof dataOrId === 'object' ? dataOrId.id : dataOrId
      console.log('API ' + path + '.get', id, dataOrId)
      return Vue.http.get(path + '/' + id, full ? {full: true} : null)
    },
    // Update/Replace
    save (fullData) {
      // (Will replace existing record with fullData, create if doesn't exist)
      let id = fullData ? fullData.id : null
      console.log('API ' + path + '.save', id, fullData)
      return Vue.http.put(path + '/' + id, fullData)
      // // 'post' is used for json-server ('put' new id returns 404)
      // // const fullData2 = _.clone(fullData)
      // // fullData2.created = true
      // fullData.created = true
      // return (!fullData.created ? Vue.http.post(path, fullData) : Vue.http.put(path + '/' + id, fullData))
      //   .then(response => {
      //     // response.body.created = true
      //     return response
      //   // }, error => {
      //   //   fullData.created = false
      //   //   throw error
      //   })
    },
    // Update/Modify
    update (partialData) {
      // (Will merge partialData into existing record)
      let id = partialData ? partialData.id : null
      console.log('API ' + path + '.update', id, partialData)
      if (config.useJsonServerMockApi && partialData.created === false) {
        const initialData = Object.assign({}, partialData)
        initialData.created = true
        // Vue.http.put(path + '/' + id, initialData)
        return Vue.http.post(path, initialData)
      }
      return Vue.http.patch(path + '/' + id, partialData)
    },
    delete (dataOrId) {
      let id = typeof dataOrId === 'object' ? dataOrId.id : dataOrId
      console.log('API ' + path + '.delete', id)
      return Vue.http.delete(path + '/' + id)
    }
  }
}
