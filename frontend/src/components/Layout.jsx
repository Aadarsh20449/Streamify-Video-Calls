import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

const Layout = ({ children, ShowSidebar = false }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar on the left */}
      {ShowSidebar && <Sidebar />}

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto pt-16">
          {" "}
          {/* add pt-16 so content clears fixed navbar */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
