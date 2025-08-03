import { Outlet } from "react-router";
import Header from "./components/layout/Header";

const App = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default App;
