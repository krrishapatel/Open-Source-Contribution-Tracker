import { Github } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/http.js";
import { useAuth } from "../auth/AuthProvider.jsx";

export function LandingPage() {
  const navigate = useNavigate();
  const { loginWithGithub, loginWithDemo } = useAuth();
  const [oauthConfigured, setOauthConfigured] = useState(null);
  const [setupMessageVisible, setSetupMessageVisible] = useState(false);

  useEffect(() => {
    api("/api/auth/config")
      .then((data) => setOauthConfigured(data.githubOAuthConfigured))
      .catch(() => setOauthConfigured(false));
  }, []);

  function tryDemo() {
    loginWithDemo();
    navigate("/dashboard");
  }

  function handleGithubLogin() {
    if (!oauthConfigured) {
      setSetupMessageVisible(true);
      return;
    }

    loginWithGithub();
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
          <button className="primary-button" onClick={handleGithubLogin}>
            <Github size={18} />
            {oauthConfigured ? "Continue with GitHub" : "Set up GitHub login"}
          </button>
          <button className="text-button" onClick={tryDemo}>
            Try demo dashboard
          </button>
          {setupMessageVisible ? (
            <div className="setup-callout" role="status">
              <strong>GitHub login needs local OAuth credentials.</strong>
              <span>
                Add your GitHub OAuth client ID and secret to <code>server/.env</code>, restart the
                backend, then try again. The demo dashboard works without credentials.
              </span>
            </div>
          ) : null}
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
