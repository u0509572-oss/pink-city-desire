import { Outlet, useLocation } from "react-router";
import { Toaster } from "react-hot-toast";
import Header from "./components/layout/Header";
import Sidebar from "./pages/admin/components/Sidebar";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isloginRoute = location.pathname.startsWith("/login");

  if (isAdminRoute) {
    // Admin layout with sidebar
    return (
      <>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="w-full overflow-y-auto h-screen ml-0 lg:ml-64 transition-all duration-300">
            <div className="p-4 lg:p-8">
              <Outlet />
            </div>
          </main>
        </div>
        <Toaster position="top-right" />
      </>
    );
  }

  // Public layout with header
  return (
    <>
      {!isloginRoute && <Header />}
      <Outlet />
      <Toaster position="top-right" />
    </>
  );
};

export default App;
