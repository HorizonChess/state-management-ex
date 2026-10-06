const Router = ReactRouterDOM.HashRouter
const { Routes, Route } = ReactRouterDOM
const { Provider } = ReactRedux
const { useEffect } = React

import { AppHeader } from "./cmps/AppHeader.jsx"
import { AppFooter } from "./cmps/AppFooter.jsx"
import { Home } from "./pages/Home.jsx"
import { About } from "./pages/About.jsx"
import { TodoIndex } from "./pages/TodoIndex.jsx"
import { TodoDetails } from "./pages/TodoDetails.jsx"
import { TodoEdit } from "./pages/TodoEdit.jsx"
import { AboutTeam } from "./cmps/AboutTeam.jsx"
import { AboutVision } from "./cmps/AboutVision.jsx"
import { Dashboard } from "./pages/Dashboard.jsx"
import { LoginSignup } from "./pages/LoginSignup.jsx"
import { store } from "./store/store.js"
import { loadStats } from "./store/todo.actions.js"
import { showErrorMsg } from "./services/event-bus.service.js"

export function RootCmp() {

    // The progress bar is on every page, so load its stats once at startup
    useEffect(() => {
        loadStats().catch(() => showErrorMsg('Cannot load progress'))
    }, [])

    return (
        <Provider store={store}>
            <Router>
                <section className="app main-layout">
                    <AppHeader />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />}>
                                <Route path="team" element={<AboutTeam />} />
                                <Route path="vision" element={<AboutVision />} />
                            </Route>
                            <Route path="/todo/:todoId" element={<TodoDetails />} />
                            <Route path="/todo/edit/:todoId" element={<TodoEdit />} />
                            <Route path="/todo/edit" element={<TodoEdit />} />
                            <Route path="/todo" element={<TodoIndex />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/auth" element={<LoginSignup />} />

                        </Routes>
                    </main>
                    <AppFooter />
                </section>
            </Router>
        </Provider>
    )
}