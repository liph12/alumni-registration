import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import type { Trend } from "../Dashboard";
import { useAppContext } from "../../providers/AppContextProvider";

interface DashboardDataCardProps {
  title: string;
  count: number | string;
  icon: SvgIconComponent;
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "info";
  subtitle?: string;
  trend?: Trend;
}

export default function DashboardDataCard({
  title,
  count,
  icon: IconComponent,
  color = "primary",
  subtitle,
  trend,
}: DashboardDataCardProps) {
  const { desktop } = useAppContext();
  const getColorHex = (colorName: string) => {
    const colors = {
      primary: "#1976d2",
      secondary: "#dc004e",
      success: "#2e7d32",
      error: "#d32f2f",
      warning: "#ed6c02",
      info: "#0288d1",
    };
    return colors[colorName as keyof typeof colors] || colors.primary;
  };

  return (
    <Card
      elevation={0}
      sx={{
        minWidth: 280,
        height: desktop ? 150 : 165,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "1px solid #ccc",
      }}
    >
      <CardContent sx={{ padding: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box flex={1}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "text.secondary",
                marginBottom: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                marginBottom: subtitle || 0,
                fontFamily: "monospace",
              }}
            >
              {count}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.75rem",
                }}
              >
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box display="flex" alignItems="center" mt={0.5}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "success.main",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  Paid: ₱{trend.xTotal.toLocaleString()}
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ mx: 3 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    fontSize: "0.75rem",
                    ml: 0.5,
                  }}
                >
                  Sponsored: ₱{trend.yTotal.toLocaleString()}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: getColorHex(color),
              width: 48,
              height: 48,
              ml: 2,
            }}
          >
            <IconComponent sx={{ fontSize: 24 }} />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}
