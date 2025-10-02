import { QRCodeSVG } from "qrcode.react";
import { Box, Button } from "@mui/material";
import { useRef } from "react";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

interface MemberQRCodeProps {
  desktop: boolean;
  value: string;
  slug: string;
}

export default function MemberQRCode({
  slug,
  value,
  desktop,
}: MemberQRCodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const downloadAsPNG = (svgRef: React.RefObject<SVGSVGElement | null>) => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();

    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngFile;
      link.download = `${slug}_cnhs_alumni_qr.png`;
      link.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      window.btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Box sx={{ my: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ border: "5px solid gray", borderRadius: 5, padding: 2 }}>
          <QRCodeSVG ref={svgRef} value={value} size={desktop ? 150 : 100} />
        </Box>
      </Box>
      <Button
        variant="contained"
        color="success"
        size="small"
        sx={{ borderRadius: 5, my: 1 }}
        startIcon={<DownloadRoundedIcon />}
        disableElevation
        onClick={() => downloadAsPNG(svgRef)}
      >
        Save QR Code
      </Button>
    </Box>
  );
}
