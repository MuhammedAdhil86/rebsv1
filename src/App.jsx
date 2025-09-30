import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/login";

import ForgotPasswordUI from "./page/forgetpasssword";
import OtpUi from "./page/otp";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgetpass" element={<ForgotPasswordUI/>}/>
          <Route path="/otp" element={<OtpUi/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
