import Header from "../components/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header fijo arriba */}
      <Header />

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        <div className="bg-white shadow rounded-lg p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
