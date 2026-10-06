import { todoService } from "../services/todo.service.js"
import { store, SET_TODOS, REMOVE_TODO, UPDATE_TODO, SET_IS_LOADING, SET_FILTER_BY, SET_STATS } from "./store.js"

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

export function removeTodo(todoId) {
    return todoService.remove(todoId)
        .then(() => {
            store.dispatch({ type: REMOVE_TODO, todoId })
            return loadStats()
        })
        .catch(err => {
            console.log('todo action -> Cannot remove todo', err)
            throw err
        })
}

export function saveTodo(todo) {
    return todoService.save(todo)
        .then(savedTodo => {
            store.dispatch({ type: UPDATE_TODO, todo: savedTodo })
            return loadStats().then(() => savedTodo)
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
