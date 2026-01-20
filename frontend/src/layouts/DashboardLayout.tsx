// src/layouts/DashboardLayout.tsx

import Header from "../components/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
     
     
      <div className="app-main">
        <Header />
        <div className="app-content">{children}</div>
      </div>

      
    </div>
  );
}
