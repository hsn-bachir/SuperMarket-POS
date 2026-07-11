import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  BarChart3,
  DollarSign,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "@/features/auth/authContext";
import { loginUser } from "../services/authService";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function Login() {
  const navigate = useNavigate();
  const { reloadUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await loginUser(username, password);

      const curUser = await reloadUser();
      console.log(curUser);

      switch (curUser.role) {
        case "admin":
          navigate("/");
          break;

        case "manager":
          navigate("/products");
          break;

        case "cashier":
          navigate("/pos");
          break;

        default:
          navigate("/pos");
      }
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* LEFT PANEL */}

      <div className="hidden lg:flex w-1/2 bg-[var(--sidebar-bg)] text-white p-16 flex-col justify-between">
        <div>
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
            <Package size={30} />
          </div>

          <h1 className="text-5xl font-semibold leading-tight">
            ERP
            <br />
            Business Suite
          </h1>

          <p className="mt-6 text-slate-300 text-lg leading-8 max-w-md">
            Modern inventory, point of sale, purchasing, reporting and business
            management software built for supermarkets and hardware stores.
          </p>
        </div>

        <div className="space-y-6">
          <Feature icon={Package} title="Inventory Management" />

          <Feature icon={ShoppingCart} title="Point of Sale" />

          <Feature icon={BarChart3} title="Reports & Analytics" />

          <Feature icon={DollarSign} title="Multi-Currency Support" />
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-xl">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold">Welcome Back</h2>

            <p className="mt-2 text-[var(--text-secondary)]">
              Sign in to continue to your workspace.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium">Username</label>

              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Password</label>

              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              className="w-full flex justify-center items-center gap-2"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </div>

          <div className="mt-10 pt-6 border-t border-[var(--border)]">
            <p className="text-center text-sm text-[var(--text-secondary)]">
              ERP Business Suite © 2026
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
        <Icon size={22} />
      </div>

      <span className="text-lg">{title}</span>
    </div>
  );
}
