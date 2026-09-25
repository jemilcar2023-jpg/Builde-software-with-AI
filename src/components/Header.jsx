export default function Header({ username, onLogout }) {
  return (
    <header className="header">
      <div className="header-inner">
        <span className="brand">🍲 Recipe Box</span>
        <div className="header-user">
          <span className="muted">Hi, {username}</span>
          <button className="btn ghost" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
