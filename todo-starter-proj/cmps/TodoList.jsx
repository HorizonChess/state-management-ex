import { TodoPreview } from "./TodoPreview.jsx"
const { Link } = ReactRouterDOM

export function TodoList({ todos, onRemoveTodo, onToggleTodo }) {

    if (!todos.length) return <p className="no-todos">No todos to show</p>

    return (
        <ul className="todo-list">
            {todos.map(todo =>
                <li key={todo._id} className={todo.isDone ? 'is-done' : ''}>
                    <TodoPreview todo={todo} onToggleTodo={()=>onToggleTodo(todo)} />
                    <section className="todo-actions">
                        <Link to={`/todo/${todo._id}`} className="btn">Details</Link>
                        <Link to={`/todo/edit/${todo._id}`} className="btn">Edit</Link>
                        <button className="btn-remove" onClick={() => onRemoveTodo(todo)}>Remove</button>
                    </section>
                </li>
            )}
        </ul>
    )
}
