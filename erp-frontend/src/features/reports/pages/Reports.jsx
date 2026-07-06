import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";

import ReportsFilters from "../components/ReportsFilters";
import ReportsTabs from "../components/ReportsTabs";

import InventorySection from "../sections/InventorySection";
import SalesSection from "../sections/SalesSection";
import FinancialSection from "../sections/FinancialSection";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("inventory");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Analyze inventory, sales and financial performance."
      />

      <ReportsFilters />

      <ReportsTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "inventory" && <InventorySection />}

      {activeTab === "sales" && <SalesSection />}

      {activeTab === "financial" && <FinancialSection />}
    </div>
  );
}
