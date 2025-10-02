import PageNotFound from "../components/PageNotFound";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/Registration";
import Dashboard from "../components/Dashboard";
import TextGenerator from "../components/TextGenerator";
import QrScanner from "../components/QrScanner";
import { Routes, Route } from "react-router-dom";
import { useAppContext } from "../providers/AppContextProvider";

export default function AppRoutes() {
  const { user } = useAppContext();
  return (
    <Routes>
      <Route path="*" element={<PageNotFound />} />
      <Route path="/" element={<TextGenerator />} />
      <Route path="/portal/alumni/login" element={<LoginForm />} />
      <Route path="/registration" element={<RegistrationForm />} />
      {user && (
        <>
          <Route path="/portal/alumni/dashboard" element={<Dashboard />} />
          <Route path="/qr-scanner" element={<QrScanner />} />
        </>
      )}
    </Routes>
  );
}
