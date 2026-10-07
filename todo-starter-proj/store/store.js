import { todoReducer } from "./todo.reducer.js"
import { userReducer } from "./user.reducer.js"

const { createStore, combineReducers } = Redux

// Each module manages its own slice: storeState.todoModule, storeState.userModule
const rootReducer = combineReducers({
    todoModule: todoReducer,
    userModule: userReducer,
})

export const store = createStore(rootReducer)
window.gStore = store
