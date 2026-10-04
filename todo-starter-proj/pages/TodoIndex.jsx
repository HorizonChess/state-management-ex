import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { SET_TODOS, REMOVE_TODO, UPDATE_TODO, SET_IS_LOADING, SET_FILTER_BY } from "../store/store.js"

const { useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux

export function TodoIndex() {

    const todos = useSelector(storeState => storeState.todos)
    const isLoading = useSelector(storeState => storeState.isLoading)
    const filterBy = useSelector(storeState => storeState.filterBy)
    const dispatch = useDispatch()

    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()

    // First visit: seed the store's filter from the URL
    useEffect(() => {
        if (filterBy) return
        const defaultFilter = todoService.getFilterFromSearchParams(searchParams)
        onSetFilterBy(defaultFilter)
    }, [])

    useEffect(() => {
        if (!filterBy) return
        setSearchParams(filterBy)
        dispatch({ type: SET_IS_LOADING, isLoading: true })
        todoService.query(filterBy)
            .then(todos => dispatch({ type: SET_TODOS, todos }))
            .catch(err => {
                console.error('err:', err)
                showErrorMsg('Cannot load todos')
            })
            .finally(() => dispatch({ type: SET_IS_LOADING, isLoading: false }))
    }, [filterBy])

    function onSetFilterBy(filterBy) {
        dispatch({ type: SET_FILTER_BY, filterBy })
    }

    function onRemoveTodo(todoId) {
        if (!confirm('Are you sure you want to delete this todo?')) return
        todoService.remove(todoId)
            .then(() => {
                dispatch({ type: REMOVE_TODO, todoId })
                showSuccessMsg(`Todo removed`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot remove todo ' + todoId)
            })
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        todoService.save(todoToSave)
            .then((savedTodo) => {
                dispatch({ type: UPDATE_TODO, todo: savedTodo })
                showSuccessMsg(`Todo is ${(savedTodo.isDone)? 'done' : 'back on your list'}`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todo._id)
            })
    }

    return (
        <section className="todo-index">
            {filterBy && <TodoFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />}
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