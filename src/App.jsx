import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import Header from "./components/layout/Header";

const App = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Toaster position="top-right" />
    </>
  );
};

export default App;
