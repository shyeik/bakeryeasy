import { useQuery } from "@tanstack/react-query";
import DataTable from "../../components/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import "./customer_reward.scss";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Loyalty {
  _id: string;
  userId: string;
  userName: string;
  orderCount: number;
  specialOfferEligible: boolean;
  status: string; // Include status field
}

interface ApiResponse {
  message: string;
  data: Loyalty[];
}

const columns: GridColDef[] = [
  { field: "displayId", headerName: "ID", width: 50 },
  { field: "DisplayuserId", headerName: "User ID", width: 100 },
  { field: "userName", headerName: "User Name", width: 150 },
  { field: "orderCount", headerName: "Order Count", width: 100 },

  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => (
      <span
        style={{
          color: params.value === "active" ? "green" : "red",
          fontWeight: "bold",
        }}
      >
        {params.value === "active" ? "Active" : "Not Active"}
      </span>
    ),
  },
];

const Customer_Reward = () => {
  const { data, isLoading, error } = useQuery<ApiResponse>(
    ["rewards"],
    async () => {
      const response = await fetch(`${API_BASE_URL}/rewards`);
      if (!response.ok) throw new Error("Error fetching rewards");
      return response.json();
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  const rows =
    data?.data.map((reward: Loyalty) => ({
      id: reward._id,
      displayId: reward._id.slice(0, 7),
      userId: reward.userId,
      DisplayuserId: reward.userId.slice(0, 7),
      userName: reward.userName,
      orderCount: reward.orderCount,
      specialOfferEligible: reward.specialOfferEligible,
      status: reward.status, // Map the status field
    })) || [];

  return (
    <div className="customerReward">
      <div className="info">
        <h1 className="rewardTitle" style={{ paddingBottom: "20px" }}>
          Customer Rewards
        </h1>
      </div>
      <DataTable slug="customrewards" columns={columns} rows={rows} />
    </div>
  );
};

export default Customer_Reward;
