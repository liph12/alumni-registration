import {
  Typography,
  Box,
  TextField,
  Container,
  Divider,
  Button,
  Alert,
} from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useAppContext } from "../providers/AppContextProvider";
import type React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const navigate = useNavigate();
  const { desktop, setUser, user } = useAppContext();
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      setErrorMessage(null);

      try {
        const response = await axios.post(
          `https://api.cnhsalumniassociation.ph/api/v1/login-attempt/?api_key=hvwHzEJoa7N3n7LJ4F9yIT41SbtkLdwV`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const { data } = response.data;
          const authToken = data.authToken;
          const user = data.user;

          localStorage.setItem("authToken", authToken);
          setUser(user);
        }
      } catch (e) {
        const error = e as AxiosError;

        if (error.response?.status === 403) {
          setErrorMessage("Invalid credentials.");
        } else {
          setErrorMessage("Something went wrong! Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/portal/alumni/dashboard");
    }
  }, [user]);

  return (
    <Container>
      <Box
        sx={{
          height: "85vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ p: 2, width: desktop ? "25vw" : "100%" }}>
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src="/cnhs-alumni-assoc-logo.png" height={50} />
              <Box>
                <Typography variant="body2" fontSize={15}>
                  CNHS Alumni
                </Typography>
                <Typography variant="body2" fontSize={19}>
                  Association
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <AccountCircleRoundedIcon fontSize="large" color="success" />
              {desktop && (
                <Typography variant="h5" component="div">
                  Login
                </Typography>
              )}
            </Box>
          </Box>
          {errorMessage && (
            <Alert severity="error" sx={{ my: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              sx={{
                mb: 2,
                fontSize: "1.2rem",
                borderRadius: 5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 5,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: 5,
                },
              }}
              name="email"
              color="success"
              size="small"
              fullWidth
              label="Email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              sx={{
                mb: 2,
                fontSize: "1.2rem",
                borderRadius: 5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 5,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: 5,
                },
              }}
              name="password"
              type="password"
              color="success"
              size="small"
              fullWidth
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ minWidth: 200, borderRadius: 5 }}
              disableElevation
              color="success"
              loading={loading}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ my: 3 }} />
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
