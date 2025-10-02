import { Box, Typography, Container } from "@mui/material";
import { useAppContext } from "../providers/AppContextProvider";

export default function PageNotFound() {
  const { desktop } = useAppContext();

  return (
    <Container>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <img src="/cnhs-alumni-assoc-logo.png" height={60} />
          <Typography
            variant={desktop ? "h4" : "h5"}
            component="div"
            sx={{ my: 2 }}
          >
            404 - Page not found.
          </Typography>
          <Typography color="textDisabled">
            The page you are looking for might have been removed had its name
            changed or is temporarily unavailable.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
