import { userService } from "../services/user.service.js"
import { store, SET_USER } from "./store.js"

export function login(credentials) {
    return userService.login(credentials)
        .then(loggedinUser => {
            store.dispatch({ type: SET_USER, loggedinUser })
            return loggedinUser
        })
        .catch(err => {
            console.log('user action -> Cannot login', err)
            throw err
        })
}

export function signup(credentials) {
    return userService.signup(credentials)
        .then(loggedinUser => {
            store.dispatch({ type: SET_USER, loggedinUser })
            return loggedinUser
        })
        .catch(err => {
            console.log('user action -> Cannot signup', err)
            throw err
        })
}

export function logout() {
    return userService.logout()
        .then(() => store.dispatch({ type: SET_USER, loggedinUser: null }))
        .catch(err => {
            console.log('user action -> Cannot logout', err)
            throw err
        })
}
