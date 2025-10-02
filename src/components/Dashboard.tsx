import MembersTable from "./MembersTable";
import { Grid, Box, Typography, Container, Divider } from "@mui/material";
import DashboardDataCard from "./utils/DashboardDataCard";
import { useEffect, useState } from "react";
import {
  PeopleOutlineRounded,
  ReceiptRounded,
  CheckCircleOutlineRounded,
  SpaceDashboardRounded,
} from "@mui/icons-material";
import { useAppContext } from "../providers/AppContextProvider";
import MemberEditingModal from "./utils/MemberEditingModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export interface FormFields {
  first_name: string;
  last_name: string;
  batch_year: string;
  status: Status;
  amount_paid: number;
  amount_sponsored: number;
}

export type Status = "active" | "paid" | "pending" | "sponsored";

export type CapturedStatus = "valid" | "invalid" | "pending";

export interface Member {
  id: number;
  index: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  batch_year: string;
  status: Status;
  paid_amount: number;
  sponsored_amount: number;
  captured_status: CapturedStatus;
  captured_at_timestamp: string;
}

export interface Trend {
  xTotal: number;
  yTotal: number;
}

interface Totals {
  totalPaid: number;
  totalSponsored: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { desktop, authToken, user } = useAppContext();
  const [members, setMembers] = useState<Member[]>([]);
  const [fetching, setFetching] = useState(false);
  const [member, setMember] = useState<Member | null>(null);
  const [openEditing, setOpenEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [totalsAccounted, setTotalsAccounted] = useState<Totals>({
    totalPaid: 0,
    totalSponsored: 0,
  });

  const onCloseEditing = () => setOpenEditing(false);

  const selectMember = (m: Member) => {
    setMember(m);
    setOpenEditing(true);
  };

  const onStatusUpdate = async (id: number, params: FormFields) => {
    setIsUpdating(true);

    try {
      const response = await axios.put(
        `https://api.cnhsalumniassociation.ph/api/v1/members/${id}?api_key=hvwHzEJoa7N3n7LJ4F9yIT41SbtkLdwV`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        const { data } = response.data;

        selectMember(data);
        setMembers((prevState: Member[]) =>
          prevState.map((member: Member) =>
            member.id === data.id
              ? {
                  ...member,
                  name: data.name,
                  first_name: data.first_name,
                  last_name: data.last_name,
                  batch_year: data.batch_year,
                  status: data.status,
                  paid_amount: data.paid_amount,
                  sponsored_amount: data.sponsored_amount,
                }
              : member
          )
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateAccountedMoney = () => {
    const totals = members.reduce(
      (acc, member) => {
        acc.totalPaid += member.paid_amount;
        acc.totalSponsored += member.sponsored_amount;
        return acc;
      },
      { totalPaid: 0, totalSponsored: 0 }
    );

    setTotalsAccounted(totals);
  };

  useEffect(() => {
    const fetchMembers = async () => {
      setFetching(true);
      const response = await axios.get(
        `https://api.cnhsalumniassociation.ph/api/v1/members?api_key=hvwHzEJoa7N3n7LJ4F9yIT41SbtkLdwV`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const { data } = response.data;
      const _data = data
        .map((member: any) => ({
          ...member,
          name: `${member.first_name} ${member.last_name}`,
        }))
        .sort((a: Member, b: Member) => a.name.localeCompare(b.name))
        .filter(
          (member: Member, index: number, self: Member[]) =>
            index ===
            self.findIndex(
              (m: Member) => m.name.toLowerCase() === member.name.toLowerCase()
            )
        )
        .map((member: Member, idx: number) => ({ ...member, index: idx + 1 }));

      setFetching(false);
      setMembers(_data);
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    if (members.length > 0) {
      calculateAccountedMoney();
    }
  }, [members]);

  if (!user) {
    navigate("/portal/alumni/login");
  }

  return (
    <Container sx={{ my: 3 }}>
      <MemberEditingModal
        open={openEditing}
        member={member}
        onClose={onCloseEditing}
        onStatusUpdate={onStatusUpdate}
        onUpdate={isUpdating}
      />
      <Box sx={{ my: 1, display: "flex", gap: 2, alignItems: "center" }}>
        <img src="/cnhs-alumni-assoc-logo.png" height={60} />
        <Box>
          <Typography variant="body2" fontSize={18}>
            {user?.name}
          </Typography>
          <Typography variant="caption">{user?.email}</Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <SpaceDashboardRounded fontSize="large" color="success" />
        {desktop && <Typography variant="h5">Dashboard</Typography>}
      </Box>
      <Divider sx={{ my: 2 }} />
      <Grid container spacing={3}>
        <Grid size={{ lg: 4, md: 4, xs: 12 }}>
          <DashboardDataCard
            count={members.length}
            icon={PeopleOutlineRounded}
            title="Total Members"
            subtitle="All time registered members"
            color="success"
          />
        </Grid>
        <Grid size={{ lg: 4, md: 4, xs: 12 }}>
          <DashboardDataCard
            count={`${
              members.filter(
                (m) => m.status === "paid" || m.status === "sponsored"
              ).length
            }`}
            icon={CheckCircleOutlineRounded}
            title="Paid Members"
            subtitle="For 9th Grand Alumni"
            color="primary"
          />
        </Grid>
        <Grid size={{ lg: 4, md: 4, xs: 12 }}>
          <DashboardDataCard
            count={`₱${(
              totalsAccounted.totalPaid + totalsAccounted.totalSponsored
            ).toLocaleString()}`}
            icon={ReceiptRounded}
            title="Accounted"
            subtitle="Total accounted money for 9th Grand Alumni"
            color="primary"
            trend={{
              xTotal: totalsAccounted.totalPaid,
              yTotal: totalsAccounted.totalSponsored,
            }}
          />
        </Grid>
        <Grid size={{ lg: 12, md: 12, xs: 12 }}>
          <MembersTable
            members={members}
            loading={fetching}
            selectMember={selectMember}
          />
        </Grid>
      </Grid>
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
