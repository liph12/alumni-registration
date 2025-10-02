import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
  Box,
  Chip,
  TextField,
  Grid,
} from "@mui/material";
import { HistoryRounded, Payment, Star, Check } from "@mui/icons-material";
import type { Status, Member, FormFields } from "../Dashboard";
import MemberQRCode from "../MemberQRCode";
import { useAppContext } from "../../providers/AppContextProvider";

interface MemberEditingModalProps {
  open: boolean;
  onClose: () => void;
  member: Member | null;
  onStatusUpdate: (memberId: number, params: FormFields) => void;
  onUpdate: boolean;
}

const statusConfig = {
  active: {
    label: "Active",
    color: "info" as const,
    icon: <Check />,
    description: "Member is active",
  },
  pending: {
    label: "Pending",
    color: "error" as const,
    icon: <HistoryRounded />,
    description: "Member registration is pending",
  },
  paid: {
    label: "Paid",
    color: "success" as const,
    icon: <Payment />,
    description: "Member has completed payment",
  },
  sponsored: {
    label: "Sponsored",
    color: "warning" as const,
    icon: <Star />,
    description: "Member is sponsored by an organization",
  },
};

export default function MemberEditingModal({
  open,
  onClose,
  member,
  onStatusUpdate,
  onUpdate,
}: MemberEditingModalProps) {
  const { desktop } = useAppContext();
  const [selectedStatus, setSelectedStatus] = useState<Status>("pending");
  const [amountPaid, setAmountPaid] = useState<string>("100");
  const [amountSponsored, setAmountSponsored] = useState<string>("0");
  const [memberForm, setMemberForm] = useState<Member | null>(null);

  const formatNumber = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (!cleaned) return "";

    return new Intl.NumberFormat("en-US").format(Number(cleaned));
  };

  const handleChangeSponsoredAmount = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value;
    setAmountSponsored(formatNumber(rawValue));
  };

  const handleChangePaidAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setAmountPaid(formatNumber(rawValue));
  };

  const handleChangeMemberForm = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMemberForm(
      (prev) => ({ ...prev, [e.target.name]: e.target.value } as Member)
    );

  useEffect(() => {
    if (member) {
      setSelectedStatus(member.status);
      setMemberForm(member);
    }
  }, [member]);

  const handleSave = () => {
    if (member) {
      const amountS = Number(amountSponsored.replace(/,/g, ""));
      const amountP = Number(amountPaid.replace(/,/g, ""));
      const params: FormFields = {
        first_name: memberForm?.first_name ?? "",
        last_name: memberForm?.last_name ?? "",
        batch_year: memberForm?.batch_year ?? "",
        status: selectedStatus,
        amount_paid:
          selectedStatus === "paid" || selectedStatus === "sponsored"
            ? amountP
            : 0,
        amount_sponsored: selectedStatus === "sponsored" ? amountS : 0,
      };

      onStatusUpdate(member.id, params);
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(event.target.value as "pending" | "paid" | "sponsored");
  };

  if (!member) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          View/Edit Member
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
            Member Information
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {member.name} • {member.email}
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
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
                color="success"
                size="small"
                fullWidth
                label="Firstname"
                value={memberForm?.first_name}
                onChange={handleChangeMemberForm}
                name="first_name"
                required
              />
            </Grid>
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
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
                color="success"
                size="small"
                fullWidth
                label="Lastname"
                value={memberForm?.last_name}
                onChange={handleChangeMemberForm}
                name="last_name"
                required
              />
            </Grid>
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
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
                color="success"
                size="small"
                fullWidth
                label="Batch"
                value={memberForm?.batch_year}
                onChange={handleChangeMemberForm}
                name="batch_year"
                required
              />
            </Grid>
            <Grid size={{ lg: 4, md: 6, xs: 12 }}></Grid>
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
              {member && (
                <MemberQRCode
                  marginY={2}
                  downloadable={false}
                  slug={""}
                  value={`${
                    member?.id
                  }_cnhs_alumni_${new Date().getFullYear()}`}
                  desktop={desktop}
                />
              )}
            </Grid>
            <Grid size={{ lg: 4, md: 6, xs: 12 }}></Grid>
          </Grid>
          <Box sx={{ mt: 1 }}>
            <Chip
              label={`${statusConfig[member.status].label}`}
              color={statusConfig[member.status].color}
              size="small"
              icon={statusConfig[member.status].icon}
            />
          </Box>
        </Box>
        {(selectedStatus === "sponsored" || selectedStatus === "paid") && (
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
            color="success"
            size="small"
            fullWidth
            label="₱ Amount Paid"
            value={amountPaid}
            onChange={handleChangePaidAmount}
            required
          />
        )}
        {selectedStatus === "sponsored" && (
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
            color="success"
            size="small"
            fullWidth
            label="₱ Amount Sponsored"
            value={amountSponsored}
            onChange={handleChangeSponsoredAmount}
            required
          />
        )}
        <FormControl component="fieldset" fullWidth>
          <FormLabel
            component="legend"
            sx={{ mb: 2, fontWeight: 500 }}
            color="success"
          >
            Select Status
          </FormLabel>
          <RadioGroup
            value={selectedStatus}
            onChange={handleStatusChange}
            sx={{ gap: 1 }}
          >
            {Object.entries(statusConfig).map(([status, config]) => (
              <Box
                key={status}
                sx={{
                  border: "1px solid",
                  borderColor:
                    selectedStatus === status ? "success.main" : "divider",
                  borderRadius: 10,
                  p: 1,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "success.main",
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <FormControlLabel
                  value={status}
                  control={<Radio color="success" />}
                  label={
                    <Box sx={{ ml: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        {config.icon}
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 500 }}
                        >
                          {config.label}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {config.description}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    margin: 0,
                    width: "100%",
                    alignItems: "flex-start",
                  }}
                />
              </Box>
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          size="small"
          sx={{ borderRadius: 5, textTransform: "none" }}
        >
          Close
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="success"
          size="small"
          // disabled={selectedStatus === member.status}
          disableElevation
          sx={{ borderRadius: 5, textTransform: "none" }}
          loading={onUpdate}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
