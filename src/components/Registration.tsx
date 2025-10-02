"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Grid,
  Paper,
  Typography,
  Checkbox,
  Divider,
  Link,
  Popover,
  Alert,
} from "@mui/material";
import MemberQRCode from "./MemberQRCode";
import { useAppContext } from "../providers/AppContextProvider";
import axios from "axios";

interface Province {
  id: string;
  name: string;
  code: string;
}

interface City {
  id: string;
  province_id: string;
  name: string;
  zip_code: string;
}

interface Barangay {
  id: string;
  city_id: string;
  name: string;
}

interface FormData {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  gender: number | "";
  batch_year: number | "";
  province: string;
  province_id: string;
  city: string;
  city_id: string;
  zip_code: string;
  barangay: string;
  birth_date: string;
  occupation: string;
  experience_after: string;
  memories: string;
  acceptConsent: boolean;
}

interface ResponseMessage {
  color: "error" | "warning" | "success";
  message: string;
  success: boolean;
}

interface MemberQRData {
  id: number;
  slug: string;
}

export default function RegistrationForm() {
  const { desktop } = useAppContext();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    gender: "",
    batch_year: "",
    province: "",
    province_id: "",
    city: "",
    city_id: "",
    zip_code: "",
    barangay: "",
    birth_date: "2000-01-01",
    occupation: "",
    experience_after: "",
    memories: "",
    acceptConsent: false,
  });

  const [filteredCities, setFilteredCities] = useState<typeof cities>([]);
  const [filteredBarangays, setFilteredBarangays] = useState<typeof barangays>(
    []
  );
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitMessage, setSubmitMessage] = useState<ResponseMessage>({
    color: "success",
    message: "Registration submitted successfully!",
    success: false,
  });
  const [loading, setLoading] = useState(false);
  const [memberData, setMemberData] = useState<MemberQRData | null>(null);
  const [anchorConsent, setAnchorConsent] = useState<HTMLAnchorElement | null>(
    null
  );

  const handleClickConsent = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setAnchorConsent(event.currentTarget);
  };

  const handleCloseConsent = () => {
    setAnchorConsent(null);
  };

  const currentYear = new Date().getFullYear();
  const batchYears = Array.from(
    { length: currentYear - 1972 },
    (_, i) => 1973 + i
  );

  useEffect(() => {
    if (formData.province_id) {
      const filtered = cities.filter(
        (city) => city.province_id === formData.province_id
      );
      setFilteredCities(filtered);
      setFormData((prev) => ({ ...prev, city: "", barangay: "" }));
      setFilteredBarangays([]);
    } else {
      setFilteredCities([]);
      setFilteredBarangays([]);
    }
  }, [formData.province_id]);

  useEffect(() => {
    if (formData.city_id) {
      const filtered = barangays.filter(
        (barangay) => barangay.city_id === formData.city_id
      );
      setFilteredBarangays(filtered);
      setFormData((prev) => ({ ...prev, barangay: "" }));
    } else {
      setFilteredBarangays([]);
    }
  }, [formData.city_id]);

  useEffect(() => {
    const fetchAddress = async () => {
      const [provincesJson, citiesJson, barangaysJson] = await Promise.all([
        axios.get("https://system.cnhsalumniassociation.ph/api/provinces"),
        axios.get("https://system.cnhsalumniassociation.ph/api/cities"),
        axios.get("https://system.cnhsalumniassociation.ph/api/barangays"),
      ]);

      const provincesData = provincesJson.data;
      const citiesData = citiesJson.data;
      const barangaysData = barangaysJson.data;

      setProvinces(provincesData);
      setCities(citiesData);
      setBarangays(barangaysData);
    };

    fetchAddress();
  }, []);

  const handleInputChange =
    (field: keyof FormData) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
    ) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const handleInputAddress =
    (fieldKey: keyof FormData, field: keyof FormData) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
    ) => {
      const index = event.target.value;
      let value: string | undefined = "";

      switch (field) {
        case "province":
          value = provinces.find((p) => p.id === index)?.name;
          break;
        case "city":
          value = cities.find((p) => p.id === index)?.name;
          break;
      }

      setFormData((prev) => ({ ...prev, [fieldKey]: index }));
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (errors[fieldKey]) {
        setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
      }
    };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (formData.gender === "") newErrors.gender = "Gender is required" as any;
    if (!formData.batch_year)
      newErrors.batch_year = "Batch year is required" as any;
    if (!formData.province) newErrors.province = "Province is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.barangay) newErrors.barangay = "Barangay is required";
    if (!formData.birth_date)
      newErrors.birth_date = "Birth date is required" as any;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (validateForm()) {
        const selectedProvince = provinces.find(
          (p) => p.id === formData.province_id
        );
        const selectedCity = cities.find((c) => c.id === formData.city_id);

        const params = {
          ...formData,
          province_name: selectedProvince?.name,
          city_name: selectedCity?.name,
          zip_code: selectedCity?.zip_code,
          status: "active",
        };

        const response = await axios.post(
          `https://api.cnhsalumniassociation.ph/api/v1/members?api_key=hvwHzEJoa7N3n7LJ4F9yIT41SbtkLdwV`,
          params,
          {
            headers: {
              "Content-Type": "application/json",
              withCredentials: false,
            },
          }
        );
        const { data } = response.data;

        setMemberData(data);
        setSubmitMessage({
          color: "success",
          message: "Registration submitted successfully!",
          success: true,
        });
        setFormData({
          first_name: "",
          middle_name: "",
          last_name: "",
          mobile_number: "",
          email: "",
          gender: "",
          batch_year: "",
          province: "",
          province_id: "",
          city: "",
          city_id: "",
          zip_code: "",
          barangay: "",
          birth_date: "2000-01-01",
          occupation: "",
          experience_after: "",
          memories: "",
          acceptConsent: false,
        });
      }
    } catch (e) {
      setSubmitMessage({
        color: "warning",
        message: "Something went wrong. Please try again.",
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const openConsent = Boolean(anchorConsent);

  return (
    <>
      <Box sx={{ maxWidth: 800, mx: "auto", p: desktop ? 3 : 1 }}>
        {submitMessage.success ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
              my: 3,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <img src="/cnhs-alumni-assoc-logo.png" height={60} />
              <Typography
                variant={desktop ? "h4" : "h5"}
                component="div"
                sx={{ my: 2 }}
              >
                Thank you for your registration!
              </Typography>
              <Typography variant="h6">
                Present this QR Code at the registration counter on October 05,
                2025.
              </Typography>
              {memberData && (
                <MemberQRCode
                  slug={memberData?.slug}
                  value={`${
                    memberData?.id
                  }_cnhs_alumni_${new Date().getFullYear()}_${new Date().getTime()}`}
                  desktop={desktop}
                />
              )}
              <Typography
                sx={{ textAlign: "left" }}
                fontSize={desktop ? 18 : 13}
              >
                To enter the event,
                <br />
                1. DOWNLOAD YOUR QR CODE.
                <br />
                2. SAVE IT ON YOUR MOBILE PHONES.
                <br />
                3. PRINT IT OUT AND BRING THEM WITH YOU (Optional).
              </Typography>
            </Box>
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: desktop ? 4 : 2,
              borderRadius: 5,
              border: "1px solid #ccc",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <img src="/cnhs-alumni-assoc-logo.png" height={50} />
              <Typography variant={desktop ? "h4" : "body1"} component="h1">
                CNHS Alumni Registration
              </Typography>
            </Box>
            <Typography
              variant="body1"
              fontSize={desktop ? 18 : 15}
              component="div"
              sx={{ my: 2 }}
            >
              We are excited to invite you to our 9th GRAND ALUMNI HOMECOMING on{" "}
              <br />
              <b>October 05, 2025</b> at <b>Caridad Gymnasium.</b> <br />
            </Typography>
            <Typography color="success">
              Please fill-up the form to confirm your attendance:
            </Typography>
            <Divider sx={{ my: 2 }} />
            {submitMessage.color === "warning" && (
              <Alert sx={{ my: 2 }} severity={submitMessage.color}>
                {submitMessage.message}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body1" gutterBottom>
                    Basic Information
                  </Typography>
                </Grid>
                <Grid size={{ lg: 6, xs: 12, sm: 6 }}>
                  <FormControl
                    fullWidth
                    error={!!errors.batch_year}
                    color="success"
                    size="small"
                    sx={{
                      fontSize: "1.2rem",
                      borderRadius: 5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 5,
                      },
                    }}
                  >
                    <InputLabel>Batch Year *</InputLabel>
                    <Select
                      value={formData.batch_year}
                      onChange={handleInputChange("batch_year")}
                      label="Batch Year *"
                    >
                      {batchYears.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.batch_year && (
                      <Typography variant="caption" color="error">
                        {errors.batch_year}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ lg: 6, xs: 12, sm: 4 }}>
                  <TextField
                    sx={{
                      fontSize: "1.2rem",
                      borderRadius: 5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 5,
                      },
                    }}
                    color="success"
                    size="small"
                    fullWidth
                    label="First Name"
                    value={formData.first_name}
                    onChange={handleInputChange("first_name")}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                    required
                  />
                </Grid>
                <Grid size={{ lg: 6, xs: 12, sm: 4 }}>
                  <TextField
                    sx={{
                      fontSize: "1.2rem",
                      borderRadius: 5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 5,
                      },
                    }}
                    color="success"
                    size="small"
                    fullWidth
                    label="Middle Name (optional)"
                    value={formData.middle_name}
                    onChange={handleInputChange("middle_name")}
                  />
                </Grid>
                <Grid size={{ lg: 6, xs: 12, sm: 4 }}>
                  <TextField
                    sx={{
                      fontSize: "1.2rem",
                      borderRadius: 5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 5,
                      },
                    }}
                    color="success"
                    size="small"
                    fullWidth
                    label="Last Name"
                    value={formData.last_name}
                    onChange={handleInputChange("last_name")}
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                    required
                  />
                </Grid>
                <Grid size={{ lg: 6, xs: 12, sm: 6 }}>
                  <TextField
                    sx={{
                      fontSize: "1.2rem",
                      borderRadius: 5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 5,
                      },
                    }}
                    color="success"
                    size="small"
                    fullWidth
                    label="Email (optional)"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid size={{ lg: 6, xs: 12, sm: 6 }}>
                  <TextField
                    sx={{
                      fontSize: "1.2rem",
                      borderRadius: 5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 5,
                      },
                    }}
                    color="success"
                    size="small"
                    fullWidth
                    label="Mobile Number (optional)"
                    type="text"
                    value={formData.mobile_number}
                    onChange={handleInputChange("mobile_number")}
                    error={!!errors.mobile_number}
                    helperText={errors.mobile_number}
                  />
                </Grid>
                <Grid size={{ lg: 6, xs: 12, sm: 6 }}>
                  <TextField
                    sx={{
                      fontSize: "1.2rem",
                      borderRadius: 5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 5,
                      },
                    }}
                    fullWidth
                    color="success"
                    size="small"
                    type="date"
                    label="Birth Date"
                    value={formData.birth_date}
                    onChange={handleInputChange("birth_date")}
                    error={!!errors.birth_date}
                    helperText={errors.birth_date}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl
                    component="fieldset"
                    error={!!errors.gender}
                    color="success"
                  >
                    <RadioGroup
                      row
                      value={formData.gender}
                      onChange={handleInputChange("gender")}
                    >
                      <FormControlLabel
                        value={0}
                        control={<Radio color="success" />}
                        label="Female"
                      />
                      <FormControlLabel
                        value={1}
                        control={<Radio color="success" />}
                        label="Male"
                      />
                    </RadioGroup>
                    {errors.gender && (
                      <Typography variant="caption" color="error">
                        {errors.gender}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                    Address Information (current)
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl
                    fullWidth
                    error={!!errors.province_id}
                    color="success"
                    size="small"
                    sx={{
                      fontSize: "1.2rem",
                      borderRadius: 5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 5,
                      },
                    }}
                  >
                    <InputLabel>Province *</InputLabel>
                    <Select
                      value={formData.province_id}
                      onChange={handleInputAddress("province_id", "province")}
                      label="Province *"
                    >
                      {provinces.map((province) => (
                        <MenuItem key={province.id} value={province.id}>
                          {province.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.province && (
                      <Typography variant="caption" color="error">
                        {errors.province}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl
                    fullWidth
                    error={!!errors.city_id}
                    color="success"
                    size="small"
                    sx={{
                      fontSize: "1.2rem",
                      borderRadius: 5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 5,
                      },
                    }}
                  >
                    <InputLabel>City *</InputLabel>
                    <Select
                      value={formData.city_id}
                      onChange={handleInputAddress("city_id", "city")}
                      label="City *"
                      disabled={!formData.province_id}
                    >
                      {filteredCities.map((city) => (
                        <MenuItem key={city.id} value={city.id}>
                          {city.name} ({city.zip_code})
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.city && (
                      <Typography variant="caption" color="error">
                        {errors.city}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl
                    fullWidth
                    error={!!errors.barangay}
                    color="success"
                    size="small"
                    sx={{
                      fontSize: "1.2rem",
                      borderRadius: 5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 5,
                      },
                    }}
                  >
                    <InputLabel>Barangay *</InputLabel>
                    <Select
                      value={formData.barangay}
                      onChange={handleInputChange("barangay")}
                      label="Barangay *"
                      disabled={!formData.city_id}
                    >
                      {filteredBarangays.map((barangay) => (
                        <MenuItem key={barangay.id} value={barangay.name}>
                          {barangay.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.barangay && (
                      <Typography variant="caption" color="error">
                        {errors.barangay}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                    Additional Information
                  </Typography>
                </Grid>
                <Grid size={{ lg: 12, xs: 12, sm: 6 }}>
                  <TextField
                    sx={{
                      fontSize: "1.2rem",
                      borderRadius: 5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 5,
                      },
                    }}
                    fullWidth
                    color="success"
                    size="small"
                    type="text"
                    label="Occupation (optional)"
                    value={formData.occupation}
                    onChange={handleInputChange("occupation")}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid size={{ lg: 12, xs: 12, sm: 6 }}>
                  <TextField
                    sx={{
                      fontSize: "1.2rem",
                      borderRadius: 5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 5,
                      },
                    }}
                    fullWidth
                    color="success"
                    size="small"
                    type="text"
                    label="Where did life take you after you graduated at CBHS/CNHS? (optional)"
                    value={formData.experience_after}
                    onChange={handleInputChange("experience_after")}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid size={{ lg: 12, xs: 12, sm: 6 }}>
                  <TextField
                    sx={{
                      fontSize: "1.2rem",
                      borderRadius: 5,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 5,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: 5,
                      },
                    }}
                    fullWidth
                    color="success"
                    size="small"
                    type="text"
                    label="Fondest memories of life at CBHS/CNHS. (optional)"
                    value={formData.memories}
                    onChange={handleInputChange("memories")}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      value={formData.acceptConsent}
                      color="success"
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          acceptConsent: e.target.checked,
                        }));
                      }}
                    />
                    <Typography>
                      I have read and agree to the CNHS Alumni Association{" "}
                      <Link
                        href="#"
                        color="success"
                        onClick={handleClickConsent}
                      >
                        Data Privacy Agreement.
                      </Link>
                      <Popover
                        open={openConsent}
                        anchorEl={anchorConsent}
                        onClose={handleCloseConsent}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                      >
                        <Box sx={{ p: 3, borderRadius: 3 }}>
                          <Typography variant="h6">
                            Data Privacy Agreement
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography
                            sx={{ width: desktop ? "30vw" : "60vw" }}
                            component="div"
                          >
                            We respect and protect your personal information. In
                            accordance with the Data Privacy Act of 2012, the
                            details you provide - such as your name, birth date,
                            and other relevant information - will be used
                            exclusively to build the CNHS Alumni Association’s
                            official database of former students.
                            <br /> <br />
                            By submitting your information, you are giving your
                            consent for us to collect and securely manage your
                            data for this purpose.
                          </Typography>
                        </Box>
                      </Popover>
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 3 }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{ minWidth: 200, borderRadius: 5 }}
                      disableElevation
                      color="success"
                      loading={loading}
                      disabled={!formData.acceptConsent}
                    >
                      Submit
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}
        <Divider sx={{ my: 3 }} />
        <Typography
          component="div"
          sx={{ textAlign: "center" }}
          color="textDisabled"
        >
          &copy; CNHS Alumni Association | 2025
        </Typography>
      </Box>
    </>
  );
}
