const { useSelector } = ReactRedux

export function Progress() {
    const stats = useSelector(storeState => storeState.stats)
    if (!stats) return null

    const { total, done } = stats
    const percent = total ? Math.round(done / total * 100) : 0

    return (
        <div className="progress" title={`${percent}% done`}>
            <div className="progress-bar" style={{ width: `${percent}%` }}></div>
            <span className="progress-text">{done} / {total} done</span>
        </div>
    )
}
