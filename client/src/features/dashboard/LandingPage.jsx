import { Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.jsx";

export function LandingPage() {
  const navigate = useNavigate();
  const { loginWithGithub, loginWithDemo } = useAuth();

  function tryDemo() {
    loginWithDemo();
    navigate("/dashboard");
  }

  return (
    <main className="landing">
      <section className="landing-panel">
        <div className="landing-copy">
          <span className="eyebrow">MERN + OAuth + GitHub API</span>
          <h1>Open Source Contribution Tracker</h1>
          <p>
            Save repositories, track issues, attach pull requests, keep research notes, and watch
            your contribution pipeline move from idea to merged PR.
          </p>
          <button className="primary-button" onClick={loginWithGithub}>
            <Github size={18} />
            Continue with GitHub
          </button>
          <button className="text-button" onClick={tryDemo}>
            Try demo dashboard
          </button>
        </div>
        <div className="terminal-preview" aria-label="Contribution pipeline preview">
          <div>
            <span>repo</span>
            <strong>facebook/react</strong>
          </div>
          <div>
            <span>issue</span>
            <strong>#28791 improve docs</strong>
          </div>
          <div>
            <span>status</span>
            <strong>coding</strong>
          </div>
          <div>
            <span>pull request</span>
            <strong>#28802 open</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
