import type React from "react";
import { useRef, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
  Container,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import BackgroundImageGenerator from "./BackgroundImageGenerator";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

const TextGenerator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("2025");
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("lg"));

  const drawText = () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set high DPI scaling for HD quality
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = 800;
      const displayHeight = 400;

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = displayWidth + "px";
      canvas.style.height = displayHeight + "px";

      ctx.scale(dpr, dpr);

      // Clear canvas
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Set fixed font properties with Antonio font family
      const fontSize = 80;
      ctx.font = `700 ${fontSize}px Antonio, Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Calculate center position
      const centerX = displayWidth / 2;
      const centerY = displayHeight / 2;

      // Draw stroke first (behind the fill)
      ctx.strokeStyle = "#d9d9d9";
      ctx.lineWidth = 8;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeText(`CLASS ${text}`, centerX, centerY);

      // Draw fill text
      ctx.fillStyle = "#545454";
      ctx.fillText(`CLASS ${text}`, centerX, centerY);

      ctx.font = `700 35px Nautilus Pompilius, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.strokeStyle = "#d9d9d9";
      ctx.lineWidth = 5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeText(
        `“Where dreams begin and memories never end.”`,
        centerX,
        centerY + 70
      );

      // Draw fill text
      ctx.fillStyle = "#545454";
      ctx.fillText(
        `“Where dreams begin and memories never end.”`,
        centerX,
        centerY + 70
      );
    } catch (error) {
      console.error("Error drawing text:", error);
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "hd-back-t-shirt-design.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  useEffect(() => {
    const loadFont = async () => {
      try {
        await Promise.all([
          document.fonts.load("700 80px 'Antonio'"),
          document.fonts.load("normal 50px 'Nautilus Pompilius'"),
        ]);
        drawText();
      } catch (error) {
        console.log("Font loading fallback");
        setTimeout(drawText, 200);
      }
    };

    loadFont();
  }, [text]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={0}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                height: { xs: 150, sm: 400, md: 500 }, // responsive height
                width: "100%",
                backgroundImage: "url('/cnhs-main-banner.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 5,
              }}
            ></Box>
          </Box>
          <Typography
            variant="h4"
            component={desktop ? "h1" : "h4"}
            gutterBottom
            align="center"
            sx={{ my: 3 }}
          >
            Generate your T-Shirt and Banner Materials
          </Typography>
          <Grid container spacing={4}>
            <Grid size={{ sm: 12, lg: 12 }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    backgroundColor: "#f8fafc",
                    borderRadius: 2,
                    display: "none",
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    style={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </Paper>
              </Box>
            </Grid>
          </Grid>
          <FormControl fullWidth sx={{ mb: 1 }}>
            <InputLabel id="year-select-label">Select Class Year</InputLabel>
            <Select
              labelId="year-select-label"
              value={text}
              label="Select Class Year"
              onChange={(e) => setText(e.target.value as string)}
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
            >
              {(() => {
                const years = [];
                for (let year = 2025; year >= 1973; year--) {
                  years.push(
                    <MenuItem key={year} value={year.toString()}>
                      {year}
                    </MenuItem>
                  );
                }
                return years;
              })()}
            </Select>
          </FormControl>
          <a href="/cnhs-t-shirt-logo.png" download>
            <Button
              variant="contained"
              fullWidth
              size="small"
              color="warning"
              startIcon={<Download />}
              disableElevation
              sx={{
                py: 1.5,
                fontWeight: "bold",
                borderRadius: 10,
                mt: 2,
              }}
            >
              T-SHIRT FRONT DESIGN
            </Button>
          </a>

          <Button
            variant="contained"
            fullWidth
            size="small"
            color="inherit"
            startIcon={<Download />}
            onClick={downloadCanvas}
            disableElevation
            sx={{
              py: 1.5,
              fontWeight: "bold",
              borderRadius: 10,
              mt: 2,
            }}
          >
            T-SHIRT BACK DESIGN
          </Button>
          <BackgroundImageGenerator text={text} />
        </CardContent>
      </Card>
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
};

export default TextGenerator;
