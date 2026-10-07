const { useEffect, useState } = React
import {Chart} from '../cmps/Chart.jsx'
import { todoService } from '../services/todo.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function Dashboard() {

    const [todos, setTodos] = useState([])
    const [importanceStats, setImportanceStats] = useState([])

    useEffect(()=>{
        todoService.query()
            .then(setTodos)
            .catch(() => showErrorMsg('Cannot load dashboard'))
        todoService.getImportanceStats()
            .then(setImportanceStats)
            .catch(() => showErrorMsg('Cannot load dashboard'))
    }, [])


    return (
        <section className="dashboard">
            <h1>Dashboard</h1>
            <h2>Statistics for {todos.length} Todos</h2>
            <hr />
            <h4>By Importance</h4>
            <Chart data={importanceStats}/>
        </section>
    )
}