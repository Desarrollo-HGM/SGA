// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import AppRouter from "./routes/AppRouter";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
function App() {
  return (
    <MantineProvider>

      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>

    </MantineProvider>
  );
}

export default App;