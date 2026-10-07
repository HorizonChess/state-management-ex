import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadStats } from "../store/todo.actions.js"
import { addActivity } from "../store/user.actions.js"

const { useState, useEffect } = React
const { useNavigate, useParams, Link } = ReactRouterDOM

export function TodoEdit() {

    const [todoToEdit, setTodoToEdit] = useState(todoService.getEmptyTodo())
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.todoId) loadTodo()
    }, [])

    function loadTodo() {
        todoService.get(params.todoId)
            .then(setTodoToEdit)
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot load todo')
            })
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setTodoToEdit(prevTodoToEdit => ({ ...prevTodoToEdit, [field]: value }))
    }

    function onSaveTodo(ev) {
        ev.preventDefault()
        const isNew = !todoToEdit._id
        todoService.save(todoToEdit)
            .then((savedTodo) => {
                // Adding or completing a todo changes the counts
                loadStats().catch(() => showErrorMsg('Cannot load progress'))

                const txt = isNew
                    ? `Added the Todo: '${savedTodo.txt}'`
                    : `Updated the Todo: '${savedTodo.txt}'`
                addActivity(txt).catch(() => showErrorMsg('Cannot record activity'))

                navigate('/todo')
                showSuccessMsg(isNew ? 'Todo added' : 'Todo saved')
            })
            .catch(err => {
                showErrorMsg('Cannot save todo')
                console.log('err:', err)
            })
    }

    const { txt, importance, isDone } = todoToEdit

    return (
        <section className="todo-edit">
            <form className="card form-stack" onSubmit={onSaveTodo} >
                <h2>{todoToEdit._id ? 'Edit todo' : 'New todo'}</h2>

                <div className="field">
                    <label htmlFor="txt">Text</label>
                    <input onChange={handleChange} value={txt} type="text" name="txt" id="txt"
                        placeholder="What needs to be done?" required />
                </div>

                <div className="field">
                    <label htmlFor="importance">Importance (1-10)</label>
                    <input onChange={handleChange} value={importance} type="number" name="importance" id="importance"
                        min="1" max="10" />
                </div>

                <div className="field field-inline">
                    <input onChange={handleChange} checked={isDone} type="checkbox" name="isDone" id="isDone" />
                    <label htmlFor="isDone">Done</label>
                </div>

                <div className="form-actions">
                    <Link to="/todo" className="btn">Cancel</Link>
                    <button className="primary">Save</button>
                </div>
            </form>
        </section>
    )
}