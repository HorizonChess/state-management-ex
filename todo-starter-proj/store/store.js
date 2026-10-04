const { createStore } = Redux

const initialState = {
    todos: null,
}

export function appReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        default:
            return state
    }
}

export const store = createStore(appReducer)
window.gStore = store
