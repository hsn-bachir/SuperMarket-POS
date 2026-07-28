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
    <div className="h-full flex flex-col gap-6">
      <PageHeader
        title="Point of Sale"
        subtitle="Scan products and complete checkout."
      />

      <div
        className="
          flex-1
          grid
          grid-cols-12
          gap-6
        "
      >
        {/* PRODUCT SEARCH */}
        <div
          className="
            col-span-12
            lg:col-span-3
          "
        >
          <SectionCard title="Products">
            <ProductSearch cart={cart} setCart={setCart} />
          </SectionCard>
        </div>

        {/* CART */}
        <div
          className="
            col-span-12
            lg:col-span-6
            overflow-hidden
          "
        >
          <SectionCard title="Current Cart" className="h-full">
            <div className="h-full overflow-y-auto">
              <CartTable cart={cart} setCart={setCart} />
            </div>
          </SectionCard>
        </div>

        {/* CHECKOUT */}
        <div
          className="
            col-span-12
            lg:col-span-3
            space-y-4
          "
        >
          <SectionCard title="Summary">
            <CartTotals cart={cart} />
          </SectionCard>

          <SectionCard title="Payment">
            <PaymentSection cart={cart} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
