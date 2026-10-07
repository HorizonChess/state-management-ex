import { todoService } from "../services/todo.service.js"
import { store } from "./store.js"
import { SET_TODOS, REMOVE_TODO, UPDATE_TODO, SET_IS_LOADING, SET_FILTER_BY, SET_STATS } from "./todo.reducer.js"
import { updateBalance, addActivity } from "./user.actions.js"

export function loadTodos(filterBy) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    return todoService.query(filterBy)
        .then(todos => {
            store.dispatch({ type: SET_TODOS, todos })
            return todos
        })
        .catch(err => {
            console.log('todo action -> Cannot load todos', err)
            throw err
        })
        .finally(() => store.dispatch({ type: SET_IS_LOADING, isLoading: false }))
}

export function removeTodo(todo) {
    return todoService.remove(todo._id)
        .then(() => {
            store.dispatch({ type: REMOVE_TODO, todoId: todo._id })
            return loadStats()
        })
        .then(() => addActivity(`Removed the Todo: '${todo.txt}'`))
        .catch(err => {
            console.log('todo action -> Cannot remove todo', err)
            throw err
        })
}

const DONE_REWARD = 10

export function saveTodo(todo) {
    const { todos } = store.getState().todoModule
    const { loggedinUser } = store.getState().userModule
    const prevTodo = todos && todos.find(currTodo => currTodo._id === todo._id)
    const isCompleted = todo.isDone && prevTodo && !prevTodo.isDone

    return todoService.save(todo)
        .then(savedTodo => {
            store.dispatch({ type: UPDATE_TODO, todo: savedTodo })
            return loadStats()
                .then(() => {
                    // Completing a todo earns a reward; un-completing never takes it back
                    if (isCompleted && loggedinUser) return updateBalance(DONE_REWARD)
                })
                .then(() => {
                    const txt = isCompleted
                        ? `Completed the Todo: '${savedTodo.txt}'`
                        : `Updated the Todo: '${savedTodo.txt}'`
                    return addActivity(txt)
                })
                .then(() => savedTodo)
        })
        .catch(err => {
            console.log('todo action -> Cannot save todo', err)
            throw err
        })
}

export function loadStats() {
    return todoService.getStats()
        .then(stats => store.dispatch({ type: SET_STATS, stats }))
        .catch(err => {
            console.log('todo action -> Cannot load stats', err)
            throw err
        })
}

export function setFilterBy(filterBy) {
    store.dispatch({ type: SET_FILTER_BY, filterBy })
}
