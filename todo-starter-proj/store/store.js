const { createStore } = Redux

export const SET_TODOS = 'SET_TODOS'

const initialState = {
    todos: null,
}

export function appReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_TODOS:
            return { ...state, todos: cmd.todos }

        default:
            return state
    }
}

export const store = createStore(appReducer)
window.gStore = store
