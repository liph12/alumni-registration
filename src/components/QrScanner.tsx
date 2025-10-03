import { Scanner } from "@yudiel/react-qr-scanner";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import {
  Box,
  Container,
  Alert,
  Button,
  Typography,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { AxiosError } from "axios";
import { useAppContext } from "../providers/AppContextProvider";
import type { Member } from "./Dashboard";
import { useState } from "react";
import { QrCode, Stop } from "@mui/icons-material";

type RESPONSE_ERR = { message: string; success: boolean };

interface AlertMessage {
  message: string;
  severinty: "error" | "warning" | "info" | "success";
}

export default function QrScanner() {
  const { authToken } = useAppContext();
  const [results, setResults] = useState<Member[]>([]);
  const [fetching, setFetching] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessage>({
    message: "Something went wrong!",
    severinty: "warning",
  });
  const [scanned, setScanned] = useState(false);
  const [onScan, setOnScan] = useState(false);

  const fetchResults = async (id: number) => {
    setFetching(true);
    setScanned(false);
    try {
      const response = await axios.get(
        `https://api.cnhsalumniassociation.ph/api/v1/members/${id}?api_key=hvwHzEJoa7N3n7LJ4F9yIT41SbtkLdwV&on_capture=true`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const { data } = response.data;

      setResults(data);
      setAlertMessage({ message: "Scanned results:", severinty: "success" });
    } catch (e) {
      const error = e as AxiosError;

      if (error.response?.status === 403) {
        const response = error.response.data as RESPONSE_ERR;

        setAlertMessage({ message: response.message, severinty: "error" });
      } else {
        setAlertMessage({
          message: "Failed to fetch data.",
          severinty: "error",
        });
      }
    } finally {
      setFetching(false);
      setScanned(true);
    }
  };

  const handleScan = () => setOnScan((prev) => !prev);

  const onResult = async (res: IDetectedBarcode[]) => {
    const result = res[0];
    const id = parseInt(result.rawValue);

    await fetchResults(id);
  };

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box>
          {onScan && (
            <Box sx={{ width: 400, textAlign: "center" }}>
              <Scanner
                paused={!onScan}
                onScan={(res) => onResult && onResult(res)}
                onError={(err) => console.error(err)}
                constraints={{ facingMode: "environment" }}
              />
            </Box>
          )}
          <Box
            sx={{
              width: 400,
              height: onScan ? 100 : 400,
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color={onScan ? "error" : "success"}
              sx={{ borderRadius: 5 }}
              disableElevation
              startIcon={onScan ? <Stop /> : <QrCode />}
              onClick={handleScan}
            >
              {onScan ? "Stop" : "Start"} Scan
            </Button>
          </Box>
        </Box>
      </Box>
      <Box>
        {scanned && (
          <Box sx={{ mb: 5 }}>
            <Alert severity={alertMessage.severinty} sx={{ mb: 2 }}>
              {alertMessage.message}
            </Alert>
            <TableContainer
              sx={{ width: "100%", maxWidth: 900, overflowX: "auto" }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Captured At</TableCell>
                    <TableCell>Batch Year</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Captured Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((res, index) => (
                    <TableRow key={index}>
                      <TableCell>{res.id}</TableCell>
                      <TableCell>
                        <Typography>{res.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {res.captured_at_timestamp}
                        </Typography>
                      </TableCell>
                      <TableCell>{res.batch_year}</TableCell>
                      <TableCell>
                        <Chip
                          label={res.status}
                          color={
                            res.status === "paid"
                              ? "success"
                              : res.status === "active"
                              ? "primary"
                              : "error"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={res.captured_status}
                          color={
                            res.captured_status === "valid"
                              ? "success"
                              : res.captured_status === "invalid"
                              ? "error"
                              : "warning"
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {fetching && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 2,
              justifyContent: "center",
            }}
          >
            <Typography>Fetching results... </Typography>
            <CircularProgress color="success" size={30} />
          </Box>
        )}
      </Box>
      <Typography
        component="div"
        sx={{ textAlign: "center" }}
        color="textDisabled"
      >
        &copy; CNHS Alumni Association | 2025
      </Typography>
    </Container>
  );
}
