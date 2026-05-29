import { Github, LogOut } from "lucide-react";
import { useAuth } from "../features/auth/AuthProvider.jsx";

export function AppShell({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Github size={24} />
          <span>Contrib Track</span>
        </div>
        <nav className="nav-list" aria-label="Main navigation">
          <a href="#overview">Overview</a>
          <a href="#repositories">Repos</a>
          <a href="#issues">Issues</a>
          <a href="#pull-requests">PRs</a>
        </nav>
        <div className="user-card">
          <img src={user.avatarUrl} alt="" />
          <div>
            <strong>{user.displayName}</strong>
            <span>@{user.githubUsername}</span>
          </div>
          <button className="icon-button" onClick={logout} aria-label="Log out" title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <main className="main-panel">{children}</main>
    </div>
  );
}
