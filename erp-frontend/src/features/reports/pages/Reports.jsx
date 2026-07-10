import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import ReportsFilters from "../components/ReportsFilters";
import ReportsTabs from "../components/ReportsTabs";

import InventorySection from "../sections/InventorySection";
import SalesSection from "../sections/SalesSection";
import FinancialSection from "../sections/FinancialSection";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("inventory");

  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Analyze inventory, sales and financial performance."
      />

      <ReportsFilters filters={filters} setFilters={setFilters} />

      <ReportsTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "inventory" && <InventorySection filters={filters} />}

      {activeTab === "sales" && <SalesSection filters={filters} />}

      {activeTab === "financial" && <FinancialSection filters={filters} />}
    </div>
  );
}
