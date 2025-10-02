import { useRef, useState, useEffect, useCallback } from "react";
import { Button, Box } from "@mui/material";
import { Download } from "@mui/icons-material";

export default function BackgroundImageGenerator({ text }: { text: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [backgroundImage, setBackgroundImage] =
    useState<HTMLImageElement | null>(null);

  const canvasWidth = 800;
  const canvasHeight = 600;

  // Load default background image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setBackgroundImage(img);
    };
    img.src = "/cnhs-banner.png";
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background image
    if (backgroundImage) {
      // Calculate scaling to fit image in canvas while maintaining aspect ratio
      const imgAspect = backgroundImage.width / backgroundImage.height;
      const canvasAspect = canvasWidth / canvasHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgAspect > canvasAspect) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgAspect;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgAspect;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);
    } else {
      // Default background
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // Set text properties - centered and styled for readability
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 100px Antonio, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillText(text, canvasWidth / 2 + 195, canvasHeight / 2 + 60);

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }, [text, backgroundImage]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a higher resolution canvas for HD download
    const hdCanvas = document.createElement("canvas");
    const hdCtx = hdCanvas.getContext("2d");
    if (!hdCtx) return;

    const scale = 2; // 2x resolution for HD
    hdCanvas.width = canvasWidth * scale;
    hdCanvas.height = canvasHeight * scale;

    // Scale the context
    hdCtx.scale(scale, scale);

    // Draw background image
    if (backgroundImage) {
      const imgAspect = backgroundImage.width / backgroundImage.height;
      const canvasAspect = canvasWidth / canvasHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgAspect > canvasAspect) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgAspect;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgAspect;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      }

      hdCtx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);
    } else {
      hdCtx.fillStyle = "#f0f0f0";
      hdCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // Set text properties
    hdCtx.fillStyle = "#ffffff";
    hdCtx.font = "700 100px Antonio, Arial, sans-serif";
    hdCtx.textAlign = "center";
    hdCtx.textBaseline = "middle";

    hdCtx.shadowOffsetX = 2;
    hdCtx.shadowOffsetY = 2;

    hdCtx.fillText(text, canvasWidth / 2 + 195, canvasHeight / 2 + 60);

    // Download the image
    hdCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "hd-class-banner.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, "image/png");
  };

  return (
    <Box>
      <Box>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            maxWidth: "100%",
            height: "auto",
            border: "1px solid #ddd",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            display: "none",
          }}
        />
        <Button
          variant="contained"
          size="small"
          fullWidth
          onClick={downloadImage}
          startIcon={<Download />}
          disableElevation
          color="success"
          sx={{
            fontWeight: "bold",
            mt: 2,
            py: 1.5,
            borderRadius: 10,
          }}
        >
          Class Banner
        </Button>
      </Box>
    </Box>
  );
}
