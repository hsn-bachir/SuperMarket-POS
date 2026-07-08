import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Truck,
  BarChart3,
  UserCog,
  Settings,
  Grid,
  Factory,
  ListCheck,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    roles: ["Admin", "Manager", "Cashier"],
  },

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
    title: "Suppliers",
    path: "/suppliers",
    icon: Factory,
    roles: ["Admin", "Manager"],
  },

  {
    title: "Purchases",
    path: "/purchases",
    icon: Truck,
    roles: ["Admin", "Manager"],
  },

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

  {
    title: "Inventory",
    path: "/inventory",
    icon: Boxes,
    roles: ["Admin", "Manager"],
  },

  {
    title: "Reports",
    path: "/reports",
    icon: BarChart3,
    roles: ["Admin", "Manager"],
  },

  {
    title: "Users",
    path: "/users",
    icon: UserCog,
    roles: ["Admin"],
  },

  {
    title: "Admin Panel",
    path: "http://localhost:8000/admin/",
    icon: Settings,
    roles: ["Admin"],
    external: true,
  },
];
