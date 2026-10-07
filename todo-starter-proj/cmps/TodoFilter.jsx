const { useState, useEffect } = React

export function TodoFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({...filterBy})

    useEffect(() => {
        // Notify parent
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

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

            default: break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    const { txt, importance, status } = filterByToEdit
    return (
        <section className="todo-filter">
            <h2>Filter Todos</h2>
            {/* Filters apply as you type; just keep Enter from submitting the form */}
            <form onSubmit={ev => ev.preventDefault()}>
                <input value={txt} onChange={handleChange}
                    type="search" placeholder="By Txt" id="txt" name="txt"
                />
                <label htmlFor="importance">Importance: </label>
                <input value={importance} onChange={handleChange}
                    type="number" placeholder="By Importance" id="importance" name="importance"
                />
                <label htmlFor="status">Status: </label>
                <select value={status} onChange={handleChange} id="status" name="status">
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="done">Done</option>
                </select>
            </form>
        </section>
    )
}