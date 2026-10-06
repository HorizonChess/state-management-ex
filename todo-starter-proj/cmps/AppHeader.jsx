const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector } = ReactRedux

import { UserMsg } from "./UserMsg.jsx"
import { showErrorMsg } from '../services/event-bus.service.js'
import { logout } from '../store/user.actions.js'


export function AppHeader() {
    const navigate = useNavigate()
    const user = useSelector(storeState => storeState.loggedinUser)

    function onLogout() {
        logout()
            .then(() => navigate('/auth'))
            .catch(() => showErrorMsg('OOPs try again'))
    }
    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                    <span> - </span>
                    {user ?
                        <section className="user-info">
                            <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
                            <button onClick={onLogout}>Logout</button>
                        </section> :
                        <NavLink to="/auth" >Login</NavLink>}
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}
