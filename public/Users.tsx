import { useQuery } from "@tanstack/react-query";
import DataTable from "../../components/dataTable/DataTable"; // Make sure the path is correct
import { GridColDef } from "@mui/x-data-grid";
import "./users.scss"; // Import the stylesheet
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define the structure of your data response for users
interface ApiResponse {
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    googleName?: string;
    authType: string;
    image: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

const columns: GridColDef[] = [
  { field: "displayId", headerName: "ID", width: 100 },
  {
    field: "image",
    headerName: "Image",
    width: 100,
    renderCell: (params) => (
      <img src={params.row.image} alt="User" width="40" />
    ),
  },
  { field: "name", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 150 },
  { field: "authType", headerName: "Auth Type", width: 100 },
];

const Users = () => {
  const { data, isLoading, error } = useQuery<ApiResponse>(
    ["users"],
    async () => {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error("Error fetching users");
      return response.json();
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  const rows =
    data?.data.map((user) => ({
      id: user._id,
      displayId: user._id.slice(0, 7),
      name: user.name || user.googleName,
      email: user.email,
      authType: user.authType,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })) || [];

  return (
    <div className="users">
      <div className="info">
        <h1>User List</h1>
      </div>

      <DataTable slug="users" columns={columns} rows={rows} />
    </div>
  );
};

export default Users;
