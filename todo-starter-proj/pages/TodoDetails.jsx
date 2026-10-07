import { todoService } from "../services/todo.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"
import { utilService } from "../services/util.service.js"

const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

export function TodoDetails() {

    const [todo, setTodo] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadTodo()
    }, [params.todoId])


    function loadTodo() {
        todoService.get(params.todoId)
            .then(setTodo)
            .catch(err => {
                console.error('err:', err)
                showErrorMsg('Cannot load todo')
                navigate('/todo')
            })
    }

    function onBack() {
        // If nothing to do here, better use a Link
        navigate('/todo')
        // navigate(-1)
    }

    if (!todo) return <div>Loading...</div>
    return (
        <section className="todo-details card">
            <h1 className={(todo.isDone)? 'done' : ''}>{todo.txt}</h1>

            <div className="todo-details-badges">
                <span className={'status-badge ' + (todo.isDone ? 'is-done' : '')}>
                    {(todo.isDone)? 'Done' : 'In your list'}
                </span>
                <span className="todo-importance">Importance {todo.importance}</span>
            </div>

            <p className="todo-details-dates">
                Created {utilService.getTimeAgo(todo.createdAt)}
                {todo.updatedAt !== todo.createdAt && ` · Updated ${utilService.getTimeAgo(todo.updatedAt)}`}
            </p>

            <div className="todo-details-actions">
                <button onClick={onBack}>Back to list</button>
                <Link to={`/todo/edit/${todo._id}`} className="btn primary">Edit</Link>
                <span className="todo-details-nav">
                    <Link to={`/todo/${todo.prevTodoId}`} className="btn">‹ Previous</Link>
                    <Link to={`/todo/${todo.nextTodoId}`} className="btn">Next ›</Link>
                </span>
            </div>
        </section>
    )
}