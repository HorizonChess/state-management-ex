import { storageService } from "./async-storage.service.js"


export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    query,
    getEmptyCredentials,
    updateBalance,
    addActivity,
    updateUser,
    getDefaultPrefs,
}
const STORAGE_KEY_LOGGEDIN = 'user'
const STORAGE_KEY = 'userDB'
const STARTING_BALANCE = 20

function query() {
    return storageService.query(STORAGE_KEY)
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function login({ username, password }) {
    return storageService.query(STORAGE_KEY)
        .then(users => {
            const user = users.find(user => user.username === username)
            if (user) return _setLoggedinUser(user)
            else return Promise.reject('Invalid login')
        })
}

function signup({ username, password, fullname }) {
    const user = { username, password, fullname }

    return storageService.query(STORAGE_KEY)
        .then(users => {
            if (users.find(user => user.username === username)) {
                return Promise.reject('Username taken')
            }
            user.createdAt = user.updatedAt = Date.now()
            user.balance = STARTING_BALANCE
            user.activities = []
            user.prefs = getDefaultPrefs()
            return storageService.post(STORAGE_KEY, user)
                .then(_setLoggedinUser)
        })
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

// Adds diff to the logged-in user's balance and saves it
function updateBalance(diff) {
    const loggedinUser = getLoggedinUser()
    if (!loggedinUser) return Promise.reject('Not logged in')

    return getById(loggedinUser._id)
        .then(user => {
            user.balance = _getBalance(user) + diff
            user.updatedAt = Date.now()
            return storageService.put(STORAGE_KEY, user)
        })
        .then(_setLoggedinUser)
}

// Saves the editable profile fields; loads the stored user first so
// fields the caller doesn't send (activities, balance...) are kept as they are
function updateUser({ _id, fullname, prefs }) {
    return getById(_id)
        .then(user => {
            user.fullname = fullname
            user.prefs = prefs
            user.updatedAt = Date.now()
            return storageService.put(STORAGE_KEY, user)
        })
        .then(_setLoggedinUser)
}

function getDefaultPrefs() {
    return { color: '#000000', bgColor: '#ffffff' }
}

// Records an activity (newest first) on the logged-in user and saves it
function addActivity(txt) {
    const loggedinUser = getLoggedinUser()
    if (!loggedinUser) return Promise.reject('Not logged in')

    return getById(loggedinUser._id)
        .then(user => {
            const activity = { txt, at: Date.now() }
            user.activities = [activity, ...(user.activities || [])]
            return storageService.put(STORAGE_KEY, user)
        })
        .then(_setLoggedinUser)
}

// Accounts created before balances existed start with the starting balance
function _getBalance(user) {
    return (typeof user.balance === 'number') ? user.balance : STARTING_BALANCE
}

function _setLoggedinUser(user) {
    const userToSave = {
        _id: user._id,
        fullname: user.fullname,
        balance: _getBalance(user),
        prefs: user.prefs || null, // null: no prefs saved, keep the app's own colors
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}

function getEmptyCredentials() {
    return {
        fullname: '',
        username: '',
        password: '',
    }
}

// signup({username: 'muki', password: 'muki1', fullname: 'Muki Ja'})
// login({username: 'muki', password: 'muki1'})

// Data Model:
// const user = {
//     _id: "KAtTl",
//     username: "muki",
//     password: "muki1",
//     fullname: "Muki Ja",
//     createdAt: 1711490430252,
//     updatedAt: 1711490430999
// }