/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import { GlobalProvider } from "./context/GlobalState";
import { Route, Routes, useNavigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import CardPage from "./pages/CardPage";
import ErrorPage from "./pages/ErrorPage";
import Transactions from "./pages/Transactions";
import FinanceChart from "./pages/FinanceChart";
import Profile from "./pages/Profile";
import HomePage from "./pages/HomePage";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Auth from "./pages/Auth";
import Loading from "./components/Loading";
import Notification from "./components/Notification";
import useResetPopup from "./components/Popups/ResetPopup";
import "./i18n/index";

function App() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const { ResetPopup, onOpen: openReset } = useResetPopup();

  useEffect(() => {
    let currentSession = null;

    const setCurrentSession = async () => {
      const { data } = await supabase.auth.getSession();
      currentSession = data.session;
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, _session) => {
      if (!_session || currentSession?.access_token !== _session.access_token) {
        setSession(_session);
      }

      if (_event == "PASSWORD_RECOVERY") {
        openReset();
      }
      if (!_session || !_session.user) {
        navigate("/login");
      }
      if (_session && window.location.pathname === "/login") {
        navigate("/");
      }
    });

    setCurrentSession();

    return () => subscription.unsubscribe();
  }, []);

  return (
    <GlobalProvider>
      {!session ? (
        <>
          <Routes>
            <Route path="/login" element={<Auth openReset={openReset} />} />
          </Routes>
        </>
      ) : (
        <>
          <MainLayout session={session}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/card" element={<CardPage />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/finance-chart" element={<FinanceChart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </MainLayout>
        </>
      )}
      <Loading />
      <Notification />
      <ResetPopup isLogIn={!!session} />
    </GlobalProvider>
  );
}

export default App;
