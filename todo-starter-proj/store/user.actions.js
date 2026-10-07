import { userService } from "../services/user.service.js"
import { store } from "./store.js"
import { SET_USER } from "./user.reducer.js"

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

export function updateBalance(diff) {
    return userService.updateBalance(diff)
        .then(loggedinUser => {
            store.dispatch({ type: SET_USER, loggedinUser })
            return loggedinUser
        })
        .catch(err => {
            console.log('user action -> Cannot update balance', err)
            throw err
        })
}

// Logs what the user did; does nothing when nobody is logged in
export function addActivity(txt) {
    if (!store.getState().userModule.loggedinUser) return Promise.resolve()

    return userService.addActivity(txt)
        .then(loggedinUser => {
            store.dispatch({ type: SET_USER, loggedinUser })
            return loggedinUser
        })
        .catch(err => {
            console.log('user action -> Cannot add activity', err)
            throw err
        })
}

export function updateUser(userToUpdate) {
    return userService.updateUser(userToUpdate)
        .then(loggedinUser => {
            store.dispatch({ type: SET_USER, loggedinUser })
            return loggedinUser
        })
        .catch(err => {
            console.log('user action -> Cannot update user', err)
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
