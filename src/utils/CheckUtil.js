export default class CheckUtil {
  // Check can edit

  static userCanEditProject (user, project) {
    return CheckUtil._userCanEditItem(user, project)
  }
  static userCanEditDocument (user, document) {
    return CheckUtil._userCanEditItem(user, document)
  }

  static _userCanEditItem (user, object) {
    let userId = user ? user.id : null
    if (!userId || !object) {
      return false
    }
    return userId === object.ownerId || object.editorIds.indexOf(userId) !== -1 ||
      object.editorIds.indexOf('*') !== -1
  }

  // Check can view

  static userCanViewProject (user, project) {
    return CheckUtil._userCanViewItem(user, project)
  }
  static userCanViewDocument (user, document) {
    return CheckUtil._userCanViewItem(user, document)
  }

  static _userCanViewItem (user, object) {
    let userId = user ? user.id : null
    if (!userId || !object) {
      return false
    }
    return object.public || userId === object.ownerId || object.viewerIds.indexOf(userId) !== -1 ||
      object.editorIds.indexOf('*') !== -1
  }
}
