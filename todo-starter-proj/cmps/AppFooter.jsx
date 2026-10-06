import { Progress } from "./Progress.jsx"

export function AppFooter() {
    return (
        <footer className="app-footer full main-layout">
            <section className="footer-container">
                <p>React Todo App</p>
                <Progress />
            </section>
        </footer>
    )
}
