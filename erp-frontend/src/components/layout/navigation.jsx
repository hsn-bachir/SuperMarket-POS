import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Truck,
  BarChart3,
  Settings,
  Grid,
  Factory,
  ListCheck,
  CreditCard,
  Receipt,
  CalendarDays,
  Users,
  Shield,
  Wrench,
  Layers,
  Briefcase,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    roles: ["Admin", "Manager"],
  },

  {
    title: "Sales",
    icon: ShoppingCart,
    roles: ["Admin", "Manager", "Cashier"],

    children: [
      {
        title: "POS",
        path: "/pos",
        icon: ShoppingCart,
        roles: ["Admin", "Manager", "Cashier"],
      },

      {
        title: "Sales",
        path: "/sales",
        icon: ListCheck,
        roles: ["Admin", "Manager", "Cashier"],
      },
    ],
  },

  {
    title: "Inventory",
    icon: Boxes,
    roles: ["Admin", "Manager"],

    children: [
      {
        title: "Products",
        path: "/products",
        icon: Package,
        roles: ["Admin", "Manager"],
      },

      {
        title: "Categories",
        path: "/category",
        icon: Grid,
        roles: ["Admin", "Manager"],
      },

      {
        title: "Services",
        path: "/services",
        icon: Wrench,
        roles: ["Admin", "Manager"],
      },

      {
        title: "Service logs",
        path: "/services/history",
        icon: Layers,
        roles: ["Admin", "Manager"],
      },

      {
        title: "Stock",
        path: "/inventory",
        icon: Boxes,
        roles: ["Admin", "Manager"],
      },
    ],
  },

  {
    title: "Purchasing",
    icon: Truck,
    roles: ["Admin", "Manager"],

    children: [
      {
        title: "Purchases",
        path: "/purchases",
        icon: Truck,
        roles: ["Admin", "Manager"],
      },

      {
        title: "Suppliers",
        path: "/suppliers",
        icon: Factory,
        roles: ["Admin", "Manager"],
      },
    ],
  },

  {
    title: "Accounting",
    icon: BarChart3,
    roles: ["Admin"],

    children: [
      {
        title: "Payments",
        path: "/accounting/payments",
        icon: CreditCard,
        roles: ["Admin", "Manager"],
      },

      {
        title: "Expenses",
        path: "/accounting/expenses",
        icon: Receipt,
        roles: ["Admin", "Manager"],
      },

      {
        title: "Periods",
        path: "/accounting/periods",
        icon: CalendarDays,
        roles: ["Admin"],
      },
    ],
  },

  {
    title: "Administration",
    icon: Settings,
    roles: ["Admin"],

    children: [
      {
        title: "Users",
        path: "/users",
        icon: Users,
        roles: ["Admin"],
      },
      {
        title: "Reports",
        path: "/reports",
        icon: BarChart3,
        roles: ["Admin"],
      },
      {
        title: "Admin Panel",
        path: "http://localhost:8000/admin/",
        icon: Shield,
        roles: ["Admin"],
        external: true,
      },
    ],
  },
];
