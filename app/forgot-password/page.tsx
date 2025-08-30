"use client";

import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  Lock,
  MessageSquare,
  Loader2,
  CheckCircle,
  Shield,
  Send,
  Home,
  KeyRound,
  Sparkles,
  Globe,
  Rocket,
  Music,
  Code,
  Brush,
  Lightbulb,
  Target,
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
import { useAuth } from "@/components/auth-provider";
import { useLanguage } from "@/components/i18n-provider";
import { HeaderControls } from "@/components/header-controls";
import { otpApi, authApi } from "@/lib/api";
import Footer from "@/components/footer";

// Email validation function
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation function
const validatePhone = (phone: string) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
};

// Password strength validation
const validatePassword = (password: string) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasMinLength = password.length >= 8;

  return {
    isValid: hasUpperCase && hasLowerCase && hasNumbers && hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasMinLength,
  };
};

export default function ForgotPasswordPage() {
  const { t } = useTranslation("common");
  const { isRTL, isLoading } = useLanguage();
  const { isAuthenticated } = useAuth();
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
    phone: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });

  // Error state
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
    general: "",
  });

  // UI state
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  // Step state
  const [currentStep, setCurrentStep] = useState<
    "email" | "phone" | "password"
  >("email");

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Reset OTP state if phone number changes
    if (field === "phone" && otpSent) {
      setOtpSent(false);
      setOtpVerified(false);
      setOtpMessage("");
      setFormData((prev) => ({ ...prev, otp: "" }));
    }
  };

  // Send OTP code for forgot password
  const handleSendOtp = async (isResend: boolean = false) => {
    if (!validatePhone(formData.phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: t("forgotPassword.validation.invalidPhone"),
      }));
      return;
    }

    // Ensure phone number starts with + for API requirement
    const phoneNumber = formData.phone.trim();
    if (!phoneNumber.startsWith("+")) {
      setErrors((prev) => ({
        ...prev,
        phone: t("forgotPassword.validation.phoneCountryCode"),
      }));
      return;
    }

    if (!formData.email || !validateEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: t("forgotPassword.validation.invalidEmail"),
      }));
      return;
    }

    setIsSendingOtp(true);
    setErrors((prev) => ({ ...prev, phone: "", otp: "", general: "" }));

    try {
      const response = await otpApi.sendOtp(
        phoneNumber,
        isResend,
        "forgot_password",
        formData.email
      );

      if (response.success) {
        setOtpSent(true);
        setOtpMessage(
          response.data?.message || t("forgotPassword.form.phone.codeSent")
        );
      } else {
        setErrors((prev) => ({
          ...prev,
          general:
            response.error?.message || "Failed to send OTP. Please try again.",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Failed to send OTP. Please try again.",
      }));
      console.error("Failed to send OTP:", error);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    await handleSendOtp(true);
    return;
  };

  // Handle OTP verification by testing with backend
  const handleVerifyOtp = async () => {
    if (!formData.otp.trim()) {
      setErrors((prev) => ({
        ...prev,
        otp: t("forgotPassword.validation.otpRequired"),
      }));
      return;
    }

    if (formData.otp.length !== 6 || !/^\d{6}$/.test(formData.otp)) {
      setErrors((prev) => ({
        ...prev,
        otp: t("forgotPassword.validation.invalidOtp"),
      }));
      return;
    }

    const phoneNumber = formData.phone.trim();
    if (!phoneNumber.startsWith("+")) {
      setErrors((prev) => ({
        ...prev,
        phone: t("forgotPassword.validation.phoneCountryCode"),
      }));
      return;
    }

    setIsSendingOtp(true);
    setErrors((prev) => ({ ...prev, otp: "", general: "" }));

    try {
      // Test OTP by calling forgot-password with a temporary password
      // If OTP is wrong, we'll get an OTP error
      // If OTP is correct but password is invalid, we'll get a password error
      const testResponse = await authApi.forgotPassword({
        email: formData.email,
        phoneNum: phoneNumber,
        new_password: "TempPass123!", // Valid format but temporary
        token: "temp", // Will be generated by API function
        otp: formData.otp,
      });

      if (testResponse.success) {
        // OTP was valid but we don't want to actually change password yet
        // This is unlikely to happen with our temp password
        setOtpVerified(true);
        setCurrentStep("password");
      } else if (testResponse.error) {
        // Check if error is specifically about OTP
        if (
          testResponse.error.id === 11 ||
          testResponse.error.message?.toLowerCase().includes("otp") ||
          testResponse.error.message?.toLowerCase().includes("verification")
        ) {
          setErrors((prev) => ({
            ...prev,
            otp: t("forgotPassword.validation.otpIncorrect"),
          }));
        } else {
          // If error is not about OTP, then OTP is likely valid
          // Error might be about password format, which means OTP passed validation
          setOtpVerified(true);
          setCurrentStep("password");
        }
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Failed to verify OTP. Please try again.",
      }));
      console.error("Failed to verify OTP:", error);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Validate form based on current step
  const validateForm = () => {
    const newErrors = {
      email: "",
      phone: "",
      newPassword: "",
      confirmPassword: "",
      otp: "",
      general: "",
    };

    if (currentStep === "email") {
      // Email validation
      if (!formData.email.trim()) {
        newErrors.email = t("forgotPassword.validation.emailRequired");
      } else if (!validateEmail(formData.email)) {
        newErrors.email = t("forgotPassword.validation.invalidEmail");
      }
    } else if (currentStep === "phone") {
      // Phone validation
      if (!formData.phone.trim()) {
        newErrors.phone = t("forgotPassword.validation.phoneRequired");
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = t("forgotPassword.validation.invalidPhone");
      }
      // OTP validation
      if (otpSent && !formData.otp.trim()) {
        newErrors.otp = t("forgotPassword.validation.otpRequired");
      } else if (
        otpSent &&
        formData.otp &&
        (formData.otp.length !== 6 || !/^\d{6}$/.test(formData.otp))
      ) {
        newErrors.otp = t("forgotPassword.validation.invalidOtp");
      }
    } else if (currentStep === "password") {
      // Password validation
      if (!formData.newPassword) {
        newErrors.newPassword = t("forgotPassword.validation.passwordRequired");
      } else {
        const passwordValidation = validatePassword(formData.newPassword);
        if (formData.newPassword.length < 8) {
          newErrors.newPassword = t(
            "forgotPassword.validation.passwordTooShort"
          );
        } else if (!passwordValidation.isValid) {
          newErrors.newPassword = t("forgotPassword.validation.passwordWeak");
        }
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = t(
          "forgotPassword.validation.confirmPasswordRequired"
        );
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = t(
          "forgotPassword.validation.passwordsDoNotMatch"
        );
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Handle step navigation
  const handleNextStep = () => {
    if (!validateForm()) {
      return;
    }

    if (currentStep === "email") {
      setCurrentStep("phone");
    } else if (currentStep === "phone" && otpVerified) {
      setCurrentStep("password");
    } else if (currentStep === "password" && !otpVerified) {
      return false;
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === "phone") {
      setCurrentStep("email");
    } else if (currentStep === "password") {
      setCurrentStep("phone");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== "password") {
      handleNextStep();
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!otpVerified || !formData.otp) {
      setErrors((prev) => ({
        ...prev,
        general: t("forgotPassword.validation.phoneNotVerified"),
      }));
      return;
    }

    setIsSubmitting(true);

    // Clear any previous general errors
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const result = await authApi.forgotPassword({
        email: formData.email,
        phoneNum: formData.phone,
        new_password: formData.newPassword,
        token: "", // Will be generated in the API function
        otp: formData.otp,
      });

      if (result.success) {
        // Redirect to login page with success message
        router.push("/login?message=password-reset-success");
      } else {
        // Show error message
        setErrors((prev) => ({
          ...prev,
          general:
            result.error?.message || "Password reset failed. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Forgot password error:", error);
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

      {/* Floating Background Elements - Same as login/register */}
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

        {/* Bottom Left Corner Dots */}
        <svg
          className="absolute bottom-12 left-12 w-22 sm:w-30 h-18 sm:h-24 opacity-12 sm:opacity-90"
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

        {/* Middle Left Dots */}
        <svg
          className="absolute top-1/2 left-8 transform -translate-y-1/2 w-18 sm:w-24 h-20 sm:h-28 opacity-8 sm:opacity-50"
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

        {/* Middle Right Dots */}
        <svg
          className="absolute top-3/8 right-8 transform -translate-y-1/2 w-18 sm:w-24 h-20 sm:h-28 opacity-8 sm:opacity-50"
          viewBox="0 0 100 120"
          fill="none"
        >
          {Array.from({ length: 8 }, (_, row) =>
            Array.from({ length: 6 }, (_, col) => (
              <circle
                key={`mid-right-${row}-${col}`}
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

        {/* Top Right Corner Dots */}
        <svg
          className="absolute top-24 right-16 w-20 sm:w-28 h-16 sm:h-20 opacity-10 sm:opacity-80"
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

        {/* Floating Icons - Same pattern as login/register */}
        <div className="hidden md:block absolute top-32 right-64 animate-float">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="hidden sm:block absolute top-64 left-20 animate-float-delayed">
          <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-32 right-64 animate-float">
          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Lock className="w-7 h-7 text-primary" />
          </div>
        </div>

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
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg">
          <Card className="border-border dark:bg-muted/80 shadow-xs">
            <CardHeader className="space-y-1 text-center">
              <CardTitle
                className={`text-2xl font-bold text-foreground ${isRTL ? "text-right" : "text-left"}`}
              >
                {t("forgotPassword.title")}
              </CardTitle>
              <CardDescription
                className={`text-muted-foreground ${isRTL ? "text-right" : "text-left"}`}
              >
                {currentStep === "email" && t("forgotPassword.subtitle.email")}
                {currentStep === "phone" && t("forgotPassword.subtitle.phone")}
                {currentStep === "password" &&
                  t("forgotPassword.subtitle.password")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1: Email */}
                {currentStep === "email" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className={isRTL ? "text-right" : "text-left"}
                    >
                      <Mail className="w-4 h-4 inline" />
                      {t("forgotPassword.form.email.label")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("forgotPassword.form.email.placeholder")}
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
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
                )}

                {/* Step 2: Phone Number & OTP */}
                {currentStep === "phone" && (
                  <>
                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className={isRTL ? "text-right" : "text-left"}
                      >
                        <Phone className="w-4 h-4 inline" />
                        {t("forgotPassword.form.phone.label")}
                      </Label>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            id="phone"
                            type="tel"
                            placeholder={t(
                              "forgotPassword.form.phone.placeholder"
                            )}
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className={`flex-1 ${isRTL ? "text-right" : "text-left"} ${errors.phone ? "border-destructive" : ""}`}
                            dir={isRTL ? "rtl" : "ltr"}
                            disabled={otpSent}
                          />
                          {!otpSent && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleSendOtp()}
                              disabled={
                                !formData.phone ||
                                !validatePhone(formData.phone) ||
                                isSendingOtp
                              }
                              className="whitespace-nowrap sm:w-auto w-full"
                            >
                              {isSendingOtp ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  {t("forgotPassword.form.phone.sendingCode")}
                                </>
                              ) : (
                                <>
                                  <MessageSquare className="w-4 h-4" />
                                  {t(
                                    "forgotPassword.form.phone.sendCodeButton"
                                  )}
                                </>
                              )}
                            </Button>
                          )}
                          {otpVerified && (
                            <div className="flex items-center px-3 py-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <span className="mx-2 text-sm text-green-700 dark:text-green-300">
                                {isRTL ? "تم التحقق" : "Verified"}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* WhatsApp OTP Message */}
                        {formData.phone &&
                          validatePhone(formData.phone) &&
                          !otpSent && (
                            <p
                              className={`text-xs text-muted-foreground flex items-center gap-1 ${isRTL ? "text-right" : "text-left"}`}
                            >
                              <MessageSquare className="w-3 h-3" />
                              {t("forgotPassword.form.phone.whatsappNote")}
                            </p>
                          )}

                        {/* OTP Message */}
                        {otpMessage && (
                          <p
                            className={`text-sm text-green-600 dark:text-green-400 ${isRTL ? "text-right" : "text-left"}`}
                          >
                            {otpMessage}
                          </p>
                        )}

                        {errors.phone && (
                          <p
                            className={`text-sm text-destructive ${isRTL ? "text-right" : "text-left"}`}
                          >
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* OTP Input */}
                    {otpSent && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="otp"
                          className={isRTL ? "text-right" : "text-left"}
                        >
                          <MessageSquare className="w-4 h-4 inline" />
                          {t("forgotPassword.form.otp.label")}
                        </Label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            id="otp"
                            type="text"
                            placeholder={t(
                              "forgotPassword.form.otp.placeholder"
                            )}
                            value={formData.otp}
                            onChange={(e) =>
                              handleInputChange("otp", e.target.value)
                            }
                            className={`flex-1 ${isRTL ? "text-right" : "text-left"} ${errors.otp ? "border-destructive" : ""}`}
                            dir={isRTL ? "rtl" : "ltr"}
                            maxLength={6}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleVerifyOtp}
                            disabled={
                              !formData.otp ||
                              formData.otp.length !== 6 ||
                              isSendingOtp
                            }
                            className="whitespace-nowrap sm:w-auto w-full"
                          >
                            {isSendingOtp ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t("forgotPassword.form.otp.verifying")}
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                {t("forgotPassword.form.otp.verifyButton")}
                              </>
                            )}
                          </Button>
                        </div>
                        {errors.otp && (
                          <p
                            className={`text-sm text-destructive ${isRTL ? "text-right" : "text-left"}`}
                          >
                            {errors.otp}
                          </p>
                        )}

                        {/* Resend OTP */}
                        <div
                          className={`text-center ${isRTL ? "text-right" : "text-left"}`}
                        >
                          <p className="text-sm text-muted-foreground">
                            {t("forgotPassword.form.otp.didntReceive")}{" "}
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              className="text-primary hover:underline"
                              disabled={isSendingOtp}
                            >
                              {t("forgotPassword.form.otp.resendButton")}
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Step 3: New Password */}
                {currentStep === "password" && (
                  <>
                    {/* New Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="newPassword"
                        className={isRTL ? "text-right" : "text-left"}
                      >
                        <Lock className="w-4 h-4 inline" />
                        {t("forgotPassword.form.newPassword.label")}
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder={t(
                            "forgotPassword.form.newPassword.placeholder"
                          )}
                          value={formData.newPassword}
                          onChange={(e) =>
                            handleInputChange("newPassword", e.target.value)
                          }
                          className={`${isRTL ? "text-right pr-10" : "text-left pr-10"} ${errors.newPassword ? "border-destructive" : ""}`}
                          dir={isRTL ? "rtl" : "ltr"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground ${isRTL ? "left-3" : "right-3"}`}
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p
                          className={`text-sm text-destructive ${isRTL ? "text-right" : "text-left"}`}
                        >
                          {errors.newPassword}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className={isRTL ? "text-right" : "text-left"}
                      >
                        <Lock className="w-4 h-4 inline" />
                        {t("forgotPassword.form.confirmPassword.label")}
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder={t(
                            "forgotPassword.form.confirmPassword.placeholder"
                          )}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className={`${isRTL ? "text-right pr-10" : "text-left pr-10"} ${errors.confirmPassword ? "border-destructive" : ""}`}
                          dir={isRTL ? "rtl" : "ltr"}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className={`absolute top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground ${isRTL ? "left-3" : "right-3"}`}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p
                          className={`text-sm text-destructive ${isRTL ? "text-right" : "text-left"}`}
                        >
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* General Error Message */}
                {errors.general && (
                  <div
                    className={`p-3 bg-destructive/10 border border-destructive/20 rounded-lg ${isRTL ? "text-right" : "text-left"}`}
                  >
                    <p className="text-sm text-destructive">{errors.general}</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                  {currentStep !== "email" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreviousStep}
                      className="flex-1"
                    >
                      {t("common.previous")}
                    </Button>
                  )}

                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={
                      isSubmitting || (currentStep === "phone" && !otpVerified)
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t("forgotPassword.form.submitting")}
                      </>
                    ) : currentStep === "password" ? (
                      <>
                        <KeyRound className="w-4 h-4" />
                        {t("forgotPassword.form.resetButton")}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {t("common.next")}
                      </>
                    )}
                  </Button>
                </div>

                {/* Footer */}
                <div
                  className={`text-center text-sm text-muted-foreground ${isRTL ? "text-right" : "text-left"}`}
                >
                  {t("forgotPassword.footer.rememberPassword")}{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    {t("forgotPassword.footer.loginLink")}
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
