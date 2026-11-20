import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import CasesPage from "./pages/CasesPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import ItemsPage from "./pages/ItemsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="items" element={<ItemsPage />} />
        <Route path="items/:id" element={<ItemDetailPage />} />
        <Route path="cases" element={<CasesPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="*" element={<p className="p-8 text-center">ไม่พบหน้าที่ต้องการ (404)</p>} />
      </Route>
    </Routes>
  );
}
