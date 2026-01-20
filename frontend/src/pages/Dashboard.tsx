import { useAuth } from "../hooks/useAuth";


const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <h1>Usuario:, {user?.username}</h1>

     
    </div>
  );
};

export default DashboardPage;
