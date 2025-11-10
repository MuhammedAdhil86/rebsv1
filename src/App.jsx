import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      {/* Toaster notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000, // auto close after 3 seconds
          style: {
            borderRadius: "8px",
          },
        }}
      />

      {/* Scrollable App Content with hidden scrollbar */}
      <div className="h-screen w-screen overflow-auto scrollbar-hide">
        <AppRoutes />
      </div>

      {/* CSS to hide scrollbars in all browsers */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;     /* Firefox */
        }
      `}</style>
    </>
  );
}

export default App;
