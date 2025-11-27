// src/components/DashboardLayout.tsx
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  console.log("📊 DashboardLayout render:", { children });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem", backgroundColor: "#f8f9fa" }}>
        {children}
      </main>
    </div>
  );
}

