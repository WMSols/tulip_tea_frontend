import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Lock, Eye, EyeOff, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useLoginMutation } from "@/Redux/Api/authApi";
import { setCredentials } from "@/Redux/Slices/authSlice";
import { useAppDispatch } from "@/Redux/Hooks/hooks";
import type { LoginRequest } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, validateForm, type FormErrors } from "@/lib/validations";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [form, setForm] = useState<LoginRequest>({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors<LoginRequest>>({});

  const clearFieldError = (field: keyof LoginRequest) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(loginSchema, form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const res = await login(form).unwrap();
      dispatch(setCredentials(res));
      localStorage.setItem("tulip_tea_auth", JSON.stringify(res));
      navigate("/", { replace: true });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description:
          err?.data?.detail || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-primary/8 via-transparent to-transparent rounded-full" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-primary/5 via-transparent to-transparent rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Login Card */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8 relative">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center shadow-md mb-4"
            >
              <Leaf className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Sign in to Tulip Tea Distributor Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/*  Phone Field */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="03XXXXXXXXX"
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    clearFieldError("phone");
                  }}
                  title="Enter a valid Pakistani phone number (e.g. 03175647123)"
                  className={cn(
                    "pl-10 h-11 bg-muted/30 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200",
                    errors.phone && "border-destructive focus:ring-destructive/20 focus:border-destructive",
                  )}
                />
              </div>
              {errors.phone && (
                <p className="text-[13px] text-destructive font-medium animate-fade-in">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    clearFieldError("password");
                  }}
                  className={cn(
                    "pl-10 pr-10 h-11 bg-muted/30 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200",
                    errors.password && "border-destructive focus:ring-destructive/20 focus:border-destructive",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[13px] text-destructive font-medium animate-fade-in">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Contact Admin
              </a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2026 Tulip Tea Distribution. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
