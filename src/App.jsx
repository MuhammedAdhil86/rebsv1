import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="">
      {/* Global toast notifications */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <AppRoutes />
    </div>
  );
}

export default App;
