import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppProvider } from "./providers/AppContextProvider";
import AppRoutes from "./config/AppRoutes";
import SuspenseOverlay from "./components/utils/SuspenseOverlay";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#2d50d3",
      },
      secondary: {
        main: "#secondary",
      },
      success: {
        main: "#0F5818",
      },
      warning: {
        main: "#ffc928",
      },
    },
  });

  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <SuspenseOverlay>
          <AppRoutes />
        </SuspenseOverlay>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
