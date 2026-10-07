export function TodoPreview({ todo, onToggleTodo }) {
    return (
        <article className="todo-preview">
            <h2 className={(todo.isDone)? 'done' : ''} onClick={onToggleTodo}
                title={todo.isDone ? 'Mark as not done' : 'Mark as done'}>
                <span className="todo-check">{todo.isDone ? '✓' : ''}</span>
                <span className="todo-txt">{todo.txt}</span>
            </h2>
            <span className="todo-importance">Importance {todo.importance}</span>
            <img src={`assets/img/${'todo'}.png`} alt="" />
        </article>
    )
}
