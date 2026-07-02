import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";

import ProductSearch from "../components/ProductSearch";
import CartTable from "../components/CartTable";
import CartTotals from "../components/CartTotals";
import PaymentSection from "../components/PaymentSection";

export default function POS() {
  const [cart, setCart] = useState([]);

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="Point of Sale"
        subtitle="Scan products and complete checkout."
      />

      <div className="flex-1 grid grid-cols-12 gap-6">
        {/* LEFT SIDE (TOOLS) */}
        <div className="col-span-12 xl:col-span-4 space-y-4">
          <SectionCard title="Scan / Search">
            <ProductSearch cart={cart} setCart={setCart} />
          </SectionCard>

          <SectionCard title="Cart Summary">
            <CartTotals cart={cart} />
          </SectionCard>
        </div>

        {/* CENTER (MAIN WORKSPACE) */}
        <div className="col-span-12 xl:col-span-5">
          <SectionCard title="Current Cart" className="min-h-[600px]">
            <CartTable cart={cart} setCart={setCart} />
          </SectionCard>
        </div>

        {/* RIGHT SIDE (PAYMENT) */}
        <div className="col-span-12 xl:col-span-3 space-y-4">
          <SectionCard title="Payment">
            <PaymentSection cart={cart} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
