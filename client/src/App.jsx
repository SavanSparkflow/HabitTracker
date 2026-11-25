import { useEffect, useState } from "react";
import api from "./api/client";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sts_token");
    if (!token) {
      setCheckingAuth(false);
      return;
    }

    api
      .get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("sts_token");
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  function handleLogout() {
    localStorage.removeItem("sts_token");
    setUser(null);
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-sm text-slate-600">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuthSuccess={setUser} />;
  }

  return <Dashboard user={user} onUserUpdate={setUser} onLogout={handleLogout} />;
}
