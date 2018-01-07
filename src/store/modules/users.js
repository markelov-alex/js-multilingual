import Vue from 'vue'
import passwordHash from 'password-hash'

// TODO watch rootState for changes to save them in user. On user login apply saved changes to rootState
// (app's state must be the same on all devices)
export default {
  // namespaced: true,
  state: {
    tempMaxUserId: 3,

    loggedInUserIds: [1, 2],
    currentUserId: 1,

    // Currently, only one user available for work. But due this user.js module it is easy to implement user login
    userById: {
      1: {
        id: 1,
        name: 'Kovpak',
        ownedProjectIds: [11],
        currentProjectId: 11
      },
      2: {
        id: 2,
        name: 'Kirov',
        ownedProjectIds: [12],
        currentProjectId: null
      },
      3: {
        id: 3,
        name: 'Stranger'
      }
    }
  },
  mutations: {
    addUser (state, user) {
      let userId = user.hasOwnProperty('id') ? user.id : null
      if (user && !userId) {
        console.warn('Failed to add user. There is no id property. userId:', userId)
        return
      }

      if (userId in state.userById) {
        console.warn('Adding user which have been already added. Overwriting value. userId:', userId)
      }
      Vue.set(state.userById, userId, {...getEmptyUser(), ...user})

      if (userId > state.tempMaxUserId) {
        state.tempMaxUserId = userId
      }
    },
    updateUser (state, user) {
      let userId = user.hasOwnProperty('id') ? user.id : null
      if (user && !userId) {
        console.warn('Failed to update user info. There is no id property. userId:', userId)
        return
      }

      if (userId in state.userById) {
        // Update existing
        Vue.set(state.userById, userId, {...state.userById[userId], ...user})
      } else {
        // Add new
        Vue.set(state.userById, userId, user)
      }
    },
    removeUser (state, user) {
      let userId = user.hasOwnProperty('id') ? user.id : String(user)
      if (userId in state.userById) {
        delete state.userById[userId]
      }
      let index = state.loggedInUserIds.indexOf(userId)
      if (index !== -1) {
        state.loggedInUserIds.splice(index, 1)
      }
    },
    logIn (state, userId) {
      if (state.loggedInUserIds.indexOf(userId) === -1) {
        state.loggedInUserIds.push(userId)
      }
    },
    logOut (state, userId) {
      let index = state.loggedInUserIds.indexOf(userId)
      if (index !== -1) {
        state.loggedInUserIds.splice(index, 1)
        state.currentUserId = null
      }
    },
    switchUser (state, userId) {
      if (state.loggedInUserIds.indexOf(userId) !== -1 && userId in state.userById) {
        state.currentUserId = userId
      }
    },

    switchProject (state, {user, projectId}) {
      // console.log('m switchProject', user.currentProjectId, projectId, 'user.id:', user.id)
      user.currentProjectId = projectId
      // console.log('m  switchProject', user.currentProjectId)
    }
  },
  actions: {
    createAccount (context, {login, password}) {
      setTimeout(() => {
        let userId = context.state.tempMaxUserId + 1
        password = passwordHash.generate(password)
        context.commit('addUser', {...getEmptyUser(), id: userId, login, password})
        context.commit('logIn', {login, password})
        context.commit('switchUser', {userId})
      }, 500)
    },
    removeAccount (context, {userId}) {
      setTimeout(() => context.commit('removeUser', userId), 500)
    },
    logIn (context, {login, password}) {
      // logIn (context, {user, userId}) {
      setTimeout(() => {
        let user
        for (user in context.state.userById) {
          if (user.login === login) {
            if (passwordHash.verify(password, user.password)) {
              context.commit('logIn', user)
              context.commit('switchUser', {userId: user.id})
            } else {
              console.warn('Failed to login. Wrong password!')
            }
          } else {
            console.warn('Failed to login. Wrong login!')
          }
        }
      }, 500)
    },
    logOut (context, {userId}) {
      setTimeout(() => context.commit('logOut', userId), 500)
    },
    switchUser (context, {userId}) {
      setTimeout(() => context.commit('switchUser', userId), 500)
    }
  },
  getters: {
    currentUser: (state, getters) => state.userById[state.currentUserId]
  }
}

function getEmptyUser () {
  return {
    id: null,
    name: null,
    ownedProjectIds: null,
    currentProjectId: null
  }
}
