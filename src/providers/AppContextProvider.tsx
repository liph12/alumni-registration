import { createContext, useContext, useState, type ReactNode } from "react";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { LicenseInfo } from "@mui/x-license";
import { useEffect } from "react";
import axios from "axios";

interface User {
  name: string;
  email: string;
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  authToken: string | null;
  desktop: boolean;
  loading: boolean;
}

const AppContext = createContext<AppState | undefined>(undefined);

const MUIX_PRO_LICENSE_KEY = import.meta.env.VITE_MUIX_PRO_LICENSE_KEY;

LicenseInfo.setLicenseKey(MUIX_PRO_LICENSE_KEY);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const authToken = localStorage.getItem("authToken") ?? null;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    const authenticate = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `https://api.cnhsalumniassociation.ph/api/v1/authenticate?api_key=hvwHzEJoa7N3n7LJ4F9yIT41SbtkLdwV`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const { data } = response.data;

        setUser(data);
      } catch (e) {
        // todo
      } finally {
        setLoading(false);
      }
    };

    authenticate();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, authToken, desktop, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
