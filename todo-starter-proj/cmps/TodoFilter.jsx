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
            {/* Filters apply as you type; just keep Enter from submitting the form */}
            <form onSubmit={ev => ev.preventDefault()}>
                <div className="field field-search">
                    <label htmlFor="txt">Search</label>
                    <input value={txt} onChange={handleChange}
                        type="search" placeholder="Search todos..." id="txt" name="txt"
                    />
                </div>
                <div className="field">
                    <label htmlFor="importance">Min. importance</label>
                    <input value={importance} onChange={handleChange}
                        type="number" min="0" max="10" placeholder="Any" id="importance" name="importance"
                    />
                </div>
                <div className="field">
                    <label htmlFor="status">Status</label>
                    <select value={status} onChange={handleChange} id="status" name="status">
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="done">Done</option>
                    </select>
                </div>
            </form>
        </section>
    )
}