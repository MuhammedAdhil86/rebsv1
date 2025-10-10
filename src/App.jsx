import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000, // <-- auto close after 3 seconds
          style: {
    
            borderRadius: "8px",
          },
        }}
      />
      <AppRoutes />
    </>
  );
}

export default App;
