import { Outlet, useNavigation } from "react-router-dom";
import Loading from "./loading"; // Import loading screen

export default function Layout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading"; // Detect route change

  return (
    <div className="relative min-h-screen">
      {isLoading && <Loading />} {/* Show loading screen during transitions */}
      <Outlet /> {/* Render current page */}
    </div>
  );
}
