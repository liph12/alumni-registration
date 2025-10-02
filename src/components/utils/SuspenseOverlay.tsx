import { Box, CircularProgress } from "@mui/material";
import { useAppContext } from "../../providers/AppContextProvider";

export default function SuspenseOverlay({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAppContext();
  return (
    <>
      {loading ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="success" />
        </Box>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
