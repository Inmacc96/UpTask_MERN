import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import NewPassword from "./pages/NewPassword";
import confirmAccount from "./pages/confirmAccount";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Esta va a ser el área pública */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forget-password" element={<ForgetPassword />} />
          <Route path="forget-password/:token" element={<NewPassword />} />
          <Route path="confirm/:token" element={<confirmAccount />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
