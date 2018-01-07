<template>
  <span>
    Mode:
    <input v-model="isDesktopMode" :value="false"
           type="radio" id="toggle-web" name="toggle">
    <label title="Cannot create, delete, and do other actions only on button click and with internet connection"
           for="toggle-web">Web</label>
    <input v-model="isDesktopMode" :value="true"
           type="radio" id="toggle-desktop" name="toggle">
    <label title="No need to click Save to save changes. Can work without internet connection. Synchronize all changes on reconnect"
           for="toggle-desktop">Desktop</label>

    <input v-if="isDesktopMode" v-model="isSyncOnForDesktop"
           type="checkbox" id="check-sync" name="toggle">
    <label v-if="isDesktopMode" for="check-sync">Sync with server</label>

    <label :style="'color: ' + onlineColor">{{isOnline === false ? 'Offline' : 'Online'}}</label>
  </span>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      isDesktopMode: {
        get: function () {
          return this.$store.state.isDesktopMode
        },
        set: function (value) {
          this.$store.commit('toggleDesktopMode', value)
        }
      },
      isSyncOnForDesktop: {
        get: function () {
          return this.$store.state.isSyncOnForDesktop
        },
        set: function (value) {
          this.$store.commit('toggleSyncOnForDesktopMode', value)
        }
      },

      ...mapState(['isOnline']),
      onlineColor (state) {
        return this.isOnline ? 'green' : (this.isOnline === false ? 'red' : 'grey')
      }
    }
  }
</script>

<style>

</style>
