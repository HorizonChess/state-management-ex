import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodos, removeTodo, saveTodo, setFilterBy } from "../store/todo.actions.js"

const { useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM
const { useSelector } = ReactRedux

export function TodoIndex() {

    const todos = useSelector(storeState => storeState.todos)
    const isLoading = useSelector(storeState => storeState.isLoading)
    const filterBy = useSelector(storeState => storeState.filterBy)

    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()

    // First visit: seed the store's filter from the URL
    useEffect(() => {
        if (filterBy) return
        const defaultFilter = todoService.getFilterFromSearchParams(searchParams)
        setFilterBy(defaultFilter)
    }, [])

    useEffect(() => {
        if (!filterBy) return
        setSearchParams(filterBy)
        loadTodos(filterBy)
            .catch(() => showErrorMsg('Cannot load todos'))
    }, [filterBy])

    function onRemoveTodo(todo) {
        if (!confirm('Are you sure you want to delete this todo?')) return
        removeTodo(todo)
            .then(() => showSuccessMsg(`Todo removed`))
            .catch(() => showErrorMsg(`Cannot remove '${todo.txt}'`))
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        saveTodo(todoToSave)
            .then((savedTodo) => {
                showSuccessMsg(`Todo is ${(savedTodo.isDone)? 'done' : 'back on your list'}`)
            })
            .catch(() => showErrorMsg(`Cannot update '${todo.txt}'`))
    }

    return (
        <section className="todo-index">
            <div className="todo-toolbar">
                {filterBy && <TodoFilter filterBy={filterBy} onSetFilterBy={setFilterBy} />}
                <Link to="/todo/edit" className="btn primary">+ Add Todo</Link>
            </div>
            {(isLoading || !todos) ?
                <p className="loading">Loading todos...</p> :
                <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />}
        </section>
    )
}