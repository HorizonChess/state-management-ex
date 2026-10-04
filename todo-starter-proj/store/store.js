import { userService } from "../services/user.service.js"

const { createStore } = Redux

export const SET_TODOS = 'SET_TODOS'
export const REMOVE_TODO = 'REMOVE_TODO'
export const UPDATE_TODO = 'UPDATE_TODO'
export const SET_IS_LOADING = 'SET_IS_LOADING'
export const SET_FILTER_BY = 'SET_FILTER_BY'

export const SET_USER = 'SET_USER'

const initialState = {
    todos: null,
    isLoading: false,
    filterBy: null,
    loggedinUser: userService.getLoggedinUser(),
}

export function appReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_TODOS:
            return { ...state, todos: cmd.todos }

        case REMOVE_TODO:
            return { ...state,
                todos: state.todos.filter(todo => todo._id !== cmd.todoId) }

        case UPDATE_TODO:
            return { ...state, todos:
                state.todos.map(todo => todo._id === cmd.todo._id ? cmd.todo : todo) }

        case SET_IS_LOADING:
            return { ...state, isLoading: cmd.isLoading }

        case SET_FILTER_BY:
            return { ...state, filterBy: { ...cmd.filterBy } }

        case SET_USER:
            return { ...state, loggedinUser: cmd.loggedinUser }

        default:
            return state
    }
}

export const store = createStore(appReducer)
window.gStore = store
