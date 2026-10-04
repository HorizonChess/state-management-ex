import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
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

    function onRemoveTodo(todoId) {
        if (!confirm('Are you sure you want to delete this todo?')) return
        removeTodo(todoId)
            .then(() => showSuccessMsg(`Todo removed`))
            .catch(() => showErrorMsg('Cannot remove todo ' + todoId))
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        saveTodo(todoToSave)
            .then((savedTodo) => {
                showSuccessMsg(`Todo is ${(savedTodo.isDone)? 'done' : 'back on your list'}`)
            })
            .catch(() => showErrorMsg('Cannot toggle todo ' + todo._id))
    }

    return (
        <section className="todo-index">
            {filterBy && <TodoFilter filterBy={filterBy} onSetFilterBy={setFilterBy} />}
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            {(isLoading || !todos) ? <div>Loading...</div> : <React.Fragment>
                <h2>Todos List</h2>
                <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
                <hr />
                <h2>Todos Table</h2>
                <div style={{ width: '60%', margin: 'auto' }}>
                    <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
                </div>
            </React.Fragment>}
        </section>
    )
}