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
    <>
      <PageHeader title="Point of Sale" subtitle="Create a new sale." />

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title="Products">
            <ProductSearch cart={cart} setCart={setCart} />
          </SectionCard>

          <SectionCard title="Current Cart">
            <CartTable cart={cart} setCart={setCart} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <CartTotals cart={cart} />

          <PaymentSection cart={cart} />
        </div>
      </div>
    </>
  );
}
