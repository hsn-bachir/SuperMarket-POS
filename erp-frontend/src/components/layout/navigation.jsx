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
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    roles: ["Admin", "Manager", "Cashier"],
  },

  {
    title: "POS",
    path: "/pos",
    icon: ShoppingCart,
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
    title: "Inventory",
    path: "/inventory",
    icon: Boxes,
    roles: ["Admin", "Manager"],
  },

  {
    title: "Purchases",
    path: "/purchases",
    icon: Truck,
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
    title: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["Admin"],
  },
];
