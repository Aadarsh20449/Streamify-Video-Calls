import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/homePage.jsx";
import SignupPage from "./pages/signupPage.jsx";
import LoginPage from "./pages/loginPage.jsx";
import OnboardingPage from "./pages/onboardingPage.jsx";
import NotificationsPage from "./pages/notificationsPage.jsx";
import CallPage from "./pages/callPage.jsx";
import ChatPage from "./pages/chatPage.jsx";
import PageLoader from "./components/pageLoader.jsx";
import Layout from "./components/Layout.jsx";

import useAuthUser from "./hooks/useAuthUser.js";

function App() {
  //tanstack reat query
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.isOnboarded;

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="h-screen" data-theme="forest">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout ShowSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate
                to={
                  !isAuthenticated
                    ? "/login"
                    : !isOnBoarded
                    ? "/onboarding"
                    : "/home"
                }
              />
            )
          }
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignupPage /> : <Navigate to={"/"} />}
          //element={<SignupPage />}
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnBoarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnBoarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to={"/"} />
              )
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated ? (
              <Layout ShowSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout ShowSidebar={false}>
                <CallPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout ShowSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
