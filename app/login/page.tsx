"use client";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  Loader2,
  Download,
  Image as ImageIcon,
  Video,
  Palette,
  Layers,
  Camera,
  Zap,
  Heart,
  Star,
  Sparkles,
  Globe,
  Shield,
  Rocket,
  Music,
  Code,
  Brush,
  Lightbulb,
  Target,
  Trophy,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/components/i18n-provider";
import { HeaderControls } from "@/components/header-controls";
import Footer from "@/components/footer";

// Email validation function
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function LoginPage() {
  const { t } = useTranslation("common");
  const { isRTL, isLoading } = useLanguage();
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to home page
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Error state
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      general: "",
    };

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t("login.validation.emailRequired");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t("login.validation.invalidEmail");
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t("login.validation.passwordRequired");
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Clear any previous general errors
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const result = await login(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      if (result.success) {
        // Redirect to home page on successful login
        router.push("/");
      } else {
        // Show error message
        setErrors((prev) => ({
          ...prev,
          general: result.error || "Login failed. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors((prev) => ({
        ...prev,
        general: "An unexpected error occurred. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary/50 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${isRTL ? "font-tajawal" : "font-sans"}`}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-200/30 dark:from-orange-950/20 dark:via-orange-900/10 dark:to-orange-800/5"></div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Dots Grid */}
        <svg
          className="absolute top-20 left-4 sm:left-10 w-24 sm:w-32 h-18 sm:h-24 opacity-20 sm:opacity-30"
          viewBox="0 0 140 100"
          fill="none"
        >
          {Array.from({ length: 6 }, (_, row) =>
            Array.from({ length: 8 }, (_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={10 + col * 16}
                cy={10 + row * 14}
                r="2"
                fill="currentColor"
                className="text-primary animate-pulse"
                style={{
                  animationDelay: `${(row + col) * 0.2}s`,
                  animationDuration: "3s",
                }}
              />
            ))
          )}
        </svg>

        {/* Floating Icons - Hidden on mobile for better UX */}
        <div className="hidden md:block absolute top-32 right-64 animate-float">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Download className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="hidden sm:block absolute top-64 left-20 animate-float-delayed">
          <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-32 right-96 animate-float">
          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Video className="w-7 h-7 text-primary" />
          </div>
        </div>

        <div className="hidden md:block absolute top-48 left-1/4 animate-float-delayed">
          <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Palette className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="hidden sm:block absolute bottom-48 left-28 animate-float">
          <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Layers className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="hidden lg:block absolute top-80 right-1/4 animate-float-delayed">
          <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Camera className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* New Icons - 2 on left, 1 on right */}
        <div className="hidden md:block absolute top-96 left-32 animate-float">
          <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="hidden sm:block absolute bottom-12 left-64 animate-float-delayed">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="hidden lg:block absolute top-40 right-8 animate-float">
          <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Additional Dots Shape - Center */}
        <svg
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 sm:w-28 h-16 sm:h-20 opacity-10 sm:opacity-15"
          viewBox="0 0 120 80"
          fill="none"
        >
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 7 }, (_, col) => (
              <circle
                key={`center-${row}-${col}`}
                cx={8 + col * 16}
                cy={8 + row * 14}
                r="1.5"
                fill="currentColor"
                className="text-primary animate-pulse"
                style={{
                  animationDelay: `${(row + col) * 0.4}s`,
                  animationDuration: "5s",
                }}
              />
            ))
          )}
        </svg>

        {/* Additional Dots */}
        <svg
          className="absolute bottom-20 right-4 sm:right-20 w-16 sm:w-24 h-14 sm:h-20 opacity-15 sm:opacity-20"
          viewBox="0 0 100 80"
          fill="none"
        >
          {Array.from({ length: 4 }, (_, row) =>
            Array.from({ length: 6 }, (_, col) => (
              <circle
                key={`bottom-${row}-${col}`}
                cx={8 + col * 14}
                cy={8 + row * 16}
                r="1.5"
                fill="currentColor"
                className="text-primary animate-pulse"
                style={{
                  animationDelay: `${(row + col) * 0.3}s`,
                  animationDuration: "4s",
                }}
              />
            ))
          )}
        </svg>

        {/* Additional Dot Shapes */}
        {/* Top Right Corner Dots */}
        <svg
          className="absolute top-16 right-16 w-20 sm:w-28 h-16 sm:h-20 opacity-10 sm:opacity-15"
          viewBox="0 0 120 80"
          fill="none"
        >
          {Array.from({ length: 4 }, (_, row) =>
            Array.from({ length: 6 }, (_, col) => (
              <circle
                key={`top-right-${row}-${col}`}
                cx={8 + col * 18}
                cy={8 + row * 16}
                r="2"
                fill="currentColor"
                className="text-primary animate-pulse"
                style={{
                  animationDelay: `${(row + col) * 0.5}s`,
                  animationDuration: "6s",
                }}
              />
            ))
          )}
        </svg>

        {/* Middle Left Dots */}
        <svg
          className="absolute top-1/2 left-8 transform -translate-y-1/2 w-18 sm:w-24 h-20 sm:h-28 opacity-8 sm:opacity-12"
          viewBox="0 0 100 120"
          fill="none"
        >
          {Array.from({ length: 6 }, (_, row) =>
            Array.from({ length: 4 }, (_, col) => (
              <circle
                key={`mid-left-${row}-${col}`}
                cx={8 + col * 20}
                cy={8 + row * 18}
                r="1.8"
                fill="currentColor"
                className="text-primary animate-pulse"
                style={{
                  animationDelay: `${(row + col) * 0.6}s`,
                  animationDuration: "7s",
                }}
              />
            ))
          )}
        </svg>

        {/* Bottom Left Corner Dots */}
        <svg
          className="absolute bottom-32 left-32 w-22 sm:w-30 h-18 sm:h-24 opacity-12 sm:opacity-18"
          viewBox="0 0 130 100"
          fill="none"
        >
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 7 }, (_, col) => (
              <circle
                key={`bottom-left-${row}-${col}`}
                cx={8 + col * 16}
                cy={8 + row * 16}
                r="1.6"
                fill="currentColor"
                className="text-primary animate-pulse"
                style={{
                  animationDelay: `${(row + col) * 0.25}s`,
                  animationDuration: "5.5s",
                }}
              />
            ))
          )}
        </svg>

        {/* Additional 10 Floating Icons */}
        <div className="hidden sm:block absolute top-32 right-96 animate-float">
          <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="hidden md:block absolute top-72 left-48 animate-float-delayed">
          <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-40 right-72 animate-float">
          <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="hidden sm:block absolute top-56 right-32 animate-float-delayed">
          <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Rocket className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="hidden md:block absolute bottom-32 left-40 animate-float">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="hidden lg:block absolute top-44 left-8 animate-float-delayed">
          <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="hidden sm:block absolute bottom-24 right-48 animate-float">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Brush className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="hidden md:block absolute top-88 right-20 animate-float-delayed">
          <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-72 left-12 animate-float">
          <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="hidden sm:block absolute top-32 left-56 animate-float-delayed">
          <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Repeat some icons for more density */}
        <div className="hidden md:block absolute top-60 left-72 animate-float">
          <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Download className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-80 right-56 animate-float-delayed">
          <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Video className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="px-4 sm:px-5 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className={`flex items-center ${isRTL ? "space-x-reverse !space-x-2" : "space-x-2"}`}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
              </div>
              <span className="text-base sm:text-xl font-semibold text-foreground">
                {t("header.logo")}
              </span>
            </Link>
            <HeaderControls />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg">
          <Card className="border-border dark:bg-muted/80 shadow-xs">
            <CardHeader className="space-y-1 text-center">
              <CardTitle
                className={`text-2xl font-bold text-foreground ${isRTL ? "text-right" : "text-left"}`}
              >
                {t("login.title")}
              </CardTitle>
              <CardDescription
                className={`text-muted-foreground ${isRTL ? "text-right" : "text-left"}`}
              >
                {t("login.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className={isRTL ? "text-right" : "text-left"}
                  >
                    <Mail className="w-4 h-4 inline" />
                    {t("login.form.email.label")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("login.form.email.placeholder")}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`${isRTL ? "text-right" : "text-left"} ${errors.email ? "border-destructive" : ""}`}
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                  {errors.email && (
                    <p
                      className={`text-sm text-destructive ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className={isRTL ? "text-right" : "text-left"}
                  >
                    <Lock className="w-4 h-4 inline" />
                    {t("login.form.password.label")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("login.form.password.placeholder")}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`${isRTL ? "text-right pr-10" : "text-left pr-10"} ${errors.password ? "border-destructive" : ""}`}
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground ${isRTL ? "left-3" : "right-3"}`}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      className={`text-sm text-destructive ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me and Forgot Password */}
                <div
                  className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex items-center space-x-2 ${isRTL ? "space-x-reverse !space-x-2" : ""}`}
                  >
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        handleInputChange("rememberMe", checked)
                      }
                    />
                    <Label
                      htmlFor="rememberMe"
                      className="text-sm cursor-pointer"
                    >
                      {t("login.form.rememberMe")}
                    </Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    {t("login.form.forgotPassword")}
                  </Link>
                </div>

                {/* General Error Message */}
                {errors.general && (
                  <div
                    className={`p-3 bg-destructive/10 border border-destructive/20 rounded-lg ${isRTL ? "text-right" : "text-left"}`}
                  >
                    <p className="text-sm text-destructive">{errors.general}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t("login.form.submitting")}
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      {t("login.form.submitButton")}
                    </>
                  )}
                </Button>

                {/* Footer */}
                <div
                  className={`text-center text-sm text-muted-foreground ${isRTL ? "text-right" : "text-left"}`}
                >
                  {t("login.footer.noAccount")}{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:underline font-medium"
                  >
                    {t("login.footer.registerLink")}
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Back to Home Button */}
          <div className="mt-6 text-center">
            <Link href="/">
              <Button
                variant="outline"
                className={`flex items-center gap-2 mx-auto ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <Home className="w-4 h-4" />
                {t("common.back")} {t("header.navigation.home")}
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
