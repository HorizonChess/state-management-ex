import { userService } from "../services/user.service.js"

export const SET_USER = 'SET_USER'

const initialState = {
    loggedinUser: userService.getLoggedinUser(),
}

export function userReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_USER:
            return { ...state, loggedinUser: cmd.loggedinUser }

        default:
            return state
    }
}
