import { Box, Chip, Button, Typography } from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DataGridPro } from "@mui/x-data-grid-pro";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import type { Member } from "./Dashboard";

const statusConfig = {
  active: {
    color: "info" as const,
  },
  pending: {
    color: "error" as const,
  },
  paid: {
    color: "success" as const,
  },
  sponsored: {
    color: "warning" as const,
  },
};

export default function MembersTable({
  members,
  loading,
  selectMember,
}: {
  members: Member[];
  loading: boolean;
  selectMember: (m: Member) => void;
}) {
  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "Index",
      width: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
    },
    {
      field: "mobile_number",
      headerName: "Mobile Number",
      width: 120,
    },
    {
      field: "batch_year",
      headerName: "Batch",
      width: 80,
      renderCell: (params: GridRenderCellParams<Member>) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography fontFamily="monospace" component="div">
            {params.row.batch_year}
          </Typography>
        </Box>
      ),
    },
    {
      field: "paid_amount",
      headerName: "Paid Amt.",
      width: 80,
      renderCell: (params: GridRenderCellParams<Member>) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography fontFamily="monospace" component="div">
            ₱{params.row.paid_amount.toLocaleString()}
          </Typography>
        </Box>
      ),
    },
    {
      field: "sponsored_amount",
      headerName: "Sponsored Amt.",
      width: 120,
      renderCell: (params: GridRenderCellParams<Member>) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography fontFamily="monospace" component="div">
            ₱{params.row.sponsored_amount.toLocaleString()}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params: GridRenderCellParams<Member>) => {
        return (
          <Chip
            label={params.row.status}
            size="small"
            color={statusConfig[params.row.status].color}
          />
        );
      },
    },
    {
      field: "id",
      headerName: "Action",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams<Member>) => (
        <Button
          variant="outlined"
          size="small"
          color="success"
          startIcon={<OpenInNewRoundedIcon fontSize="small" />}
          sx={{ borderRadius: 5, textTransform: "none", py: 0.1 }}
          disableElevation
          onClick={() => selectMember(params.row)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box height="60vh" sx={{ border: "1px solid #ccc", borderRadius: 3, p: 1 }}>
      <DataGridPro
        label="Members"
        showCellVerticalBorder
        showColumnVerticalBorder
        showToolbar
        density="compact"
        rows={members}
        loading={loading}
        columns={columns}
        disableRowSelectionOnClick
        sx={{ border: "none" }}
      />
    </Box>
  );
}
