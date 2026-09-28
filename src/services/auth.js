// User registration, login, logout and password reset using Back4App's built-in _User class.
import Parse from '../lib/parse'

export function getCurrentUser() {
  return Parse.User.current()
}

export async function register(username, email, password) {
  const user = new Parse.User()
  user.set('username', username)
  user.set('email', email)
  user.set('password', password)
  return user.signUp()
}

export async function login(username, password) {
  return Parse.User.logIn(username, password)
}

export async function logout() {
  return Parse.User.logOut()
}

// Back4App emails the user a link to choose a new password.
export async function requestPasswordReset(email) {
  return Parse.User.requestPasswordReset(email)
}
