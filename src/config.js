/**
 * App config.
 *
 * Using 1:
 * Use through import:
 *  import config from '@/config'
 *  Vue.http.options.root = config.apiBaseURL
 *
 * Using 2:
 * Also one can add global variable config with webpack.DefinePlugin:
 *  plugins: [
 *    new webpack.DefinePlugin({
 *      'config': JSON.stringify(require('../src/config'))
 *    })
 *  ]
 * Add to .eslingrc.js:
 *  globals: {
 *    config: false// set true for overwrite
 *  }
 */
const config = {
  'dev': {
    // 'npm run mockapi' which starts 'json-server' --
    // RESTful interface to static/mocks/api/db.json
    apiBaseURL: 'http://localhost:3001',
    useJsonServerMockApi: true,
    // webSyncEnabled: true,
    localSaveEnabled: true
  },
  'prod': {
    apiBaseURL: 'https://prodserver/api/v1',
    // webSyncEnabled: true,
    localSaveEnabled: true
  }
}
const currentConfig = process.env.NODE_ENV === 'production' ? config.prod : config.dev
console.log('config.js', currentConfig)

module.exports = currentConfig
