import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./layouts/ProtectedRoute";


import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import NewPassword from "./pages/NewPassword";
import ConfirmAccount from "./pages/ConfirmAccount";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import Project from "./pages/Project";
import EditProject from "./pages/EditProject";
import NewPartner from "./pages/NewPartner";

import { AuthProvider } from "./context/AuthProvider"
import { ProjectsProvider } from "./context/ProjectsProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectsProvider>
          <Routes>
            {/* Esta va a ser el área pública */}
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forget-password" element={<ForgetPassword />} />
              <Route path="forget-password/:token" element={<NewPassword />} />
              <Route path="confirm/:token" element={<ConfirmAccount />} />
            </Route>
            {/* Área privada */}
            <Route path="/projects" element={<ProtectedRoute />}>
              <Route index element={<Projects />} />
              <Route path="create-project" element={<NewProject />} />
              <Route path="new-partner/:id" element={<NewPartner />} />
              <Route path=":id" element={<Project />} />
              <Route path="edit/:id" element={<EditProject />} />
            </Route>
          </Routes>
        </ProjectsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
