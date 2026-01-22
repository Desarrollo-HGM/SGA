import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { MantineProvider } from "@mantine/core";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
   <MantineProvider
  defaultColorScheme="light"
  theme={{
    fontFamily: "Inter, sans-serif",
    primaryColor: "blue",
  }}
>

      <AuthProvider>
        <App />
      </AuthProvider>
    </MantineProvider>
  </StrictMode>
);