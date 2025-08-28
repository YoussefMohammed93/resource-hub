"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/components/i18n-provider";
import { HeaderControls } from "@/components/header-controls";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Shield,
  Globe,
  Download,
  CreditCard as CreditCardIcon,
  Zap,
  Target,
  Trophy,
  Rocket,
  Heart,
  Star,
  Lightbulb,
  ImageIcon,
} from "lucide-react";

// Loading skeleton component
function HelpCenterSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto max-w-4xl px-4 sm:px-5 text-center">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
        </div>
      </section>

      {/* FAQ Section Skeleton */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto max-w-4xl px-4 sm:px-5">
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 animate-pulse"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section Skeleton */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto max-w-4xl px-4 sm:px-5 text-center">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-8"
              >
                <Skeleton className="w-16 h-16 rounded-xl mx-auto mb-6" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-3 w-24 mx-auto mb-6" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default function HelpCenterPage() {
  const { t } = useTranslation("common");
  const { isRTL, isLoading } = useLanguage();
  const [feedbackGiven, setFeedbackGiven] = useState(new Set());

  // Fake API function for feedback
  const handleFeedback = async (faqId: string, isHelpful: boolean) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (isHelpful) {
        toast.success(t("helpCenter.feedback.thanks"), {
          description: "Thank you for your positive feedback!",
          duration: 3000,
        });
      } else {
        toast.info("Thanks for your feedback", {
          description: "We'll work on improving this article.",
          duration: 3000,
        });
      }

      // Hide feedback buttons for this FAQ
      setFeedbackGiven((prev) => new Set([...prev, faqId]));
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit feedback", {
        description: "Please try again later.",
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return <HelpCenterSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Dots Grid */}
        <svg
          className={`absolute top-20 ${isRTL ? "right-4 sm:right-10" : "left-4 sm:left-10"} w-24 sm:w-32 h-18 sm:h-24 opacity-20 sm:opacity-30`}
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
        <div
          className={`hidden md:block absolute top-32 ${isRTL ? "left-64" : "right-64"} animate-float`}
        >
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Download className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div
          className={`hidden sm:block absolute top-64 ${isRTL ? "right-20" : "left-20"} animate-float-delayed`}
        >
          <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div
          className={`hidden sm:block absolute bottom-64 ${isRTL ? "right-64" : "left-64"} animate-float-delayed`}
        >
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div
          className={`hidden lg:block absolute top-40 ${isRTL ? "left-8" : "right-8"} animate-float`}
        >
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
          className={`absolute bottom-20 ${isRTL ? "left-4 sm:left-20" : "right-4 sm:right-20"} w-16 sm:w-24 h-14 sm:h-20 opacity-15 sm:opacity-20`}
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

        {/* Additional 10 Floating Icons */}
        <div
          className={`hidden sm:block absolute top-20 ${isRTL ? "left-32" : "right-32"} animate-float`}
        >
          <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div
          className={`hidden md:block absolute top-72 ${isRTL ? "right-48" : "left-48"} animate-float-delayed`}
        >
          <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div
          className={`hidden lg:block absolute bottom-40 ${isRTL ? "left-32" : "right-32"} animate-float`}
        >
          <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div
          className={`hidden sm:block absolute top-56 ${isRTL ? "left-12" : "right-12"} animate-float-delayed`}
        >
          <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Rocket className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div
          className={`hidden md:block absolute top-88 ${isRTL ? "left-20" : "right-20"} animate-float-delayed`}
        >
          <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div
          className={`hidden lg:block absolute bottom-72 ${isRTL ? "right-12" : "left-12"} animate-float`}
        >
          <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div
          className={`hidden sm:block absolute top-32 ${isRTL ? "right-56" : "left-56"} animate-float-delayed`}
        >
          <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <Trophy className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div
          className={`hidden lg:block absolute top-20 ${isRTL ? "right-8" : "left-8"}`}
        >
          <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-float">
            <Zap className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div
          className={`hidden sm:block absolute bottom-32 ${isRTL ? "right-32" : "left-32"} animate-float`}
        >
          <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-5 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-1 sm:gap-2 cursor-pointer"
            >
              <div
                className={`${isRTL && "ml-2"} w-8 h-8 bg-primary rounded-lg flex items-center justify-center`}
              >
                <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
              </div>
              <span
                className={`text-base sm:text-xl font-semibold text-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
              >
                {t("header.logo")}
              </span>
            </Link>
            <HeaderControls />
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* FAQ Section */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-secondary via-secondary/50 to-secondary">
          <div className="container mx-auto max-w-4xl px-4 sm:px-5 text-center pb-10">
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight ${isRTL ? "font-tajawal" : "font-sans"}`}
            >
              {isRTL ? (
                t("helpCenter.faq.title.ar", {
                  defaultValue: "الأسئلة الشائعة",
                })
              ) : (
                <>
                  {t("helpCenter.faq.title.en", {
                    defaultValue: "Frequently Asked ",
                  })}
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {t("helpCenter.faq.title.highlight", {
                      defaultValue: "Questions",
                    })}
                  </span>
                </>
              )}
            </h1>
            <p
              className={`text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed ${isRTL ? "font-tajawal font-medium" : "font-sans"}`}
            >
              {isRTL
                ? t("helpCenter.faq.description.ar", {
                    defaultValue:
                      "اعثر على إجابات سريعة لأكثر الأسئلة شيوعًا حول منصتنا",
                  })
                : t("helpCenter.faq.description.en", {
                    defaultValue:
                      "Find quick answers to the most common questions about our platform",
                  })}
            </p>
          </div>
          <div className="container mx-auto max-w-4xl px-4 sm:px-5">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                {
                  id: "what-is-platform",
                  question: {
                    en: "What is ResourceHub and how does it work?",
                    ar: "ما هو ResourceHub وكيف يعمل؟",
                  },
                  answer: {
                    en: "ResourceHub is a premium platform that provides access to millions of high-quality creative resources from top platforms like Freepik, Shutterstock, Adobe Stock, and more. We offer a credit-based system where you can download premium content using credits from your subscription plan.",
                    ar: "ResourceHub هو منصة متميزة توفر الوصول إلى ملايين الموارد الإبداعية عالية الجودة من أفضل المنصات مثل Freepik و Shutterstock و Adobe Stock والمزيد. نحن نقدم نظام قائم على الاعتمادات حيث يمكنك تحميل المحتوى المتميز باستخدام الاعتمادات من خطة اشتراكك.",
                  },
                  icon: Sparkles,
                },
                {
                  id: "how-credits-work",
                  question: {
                    en: "How do credits work and what can I download?",
                    ar: "كيف تعمل الاعتمادات وماذا يمكنني تحميل؟",
                  },
                  answer: {
                    en: "Credits are used to download premium resources from supported platforms. Each download typically costs 1 credit, regardless of the file type (images, vectors, videos, or templates). Your credits are valid for the duration of your subscription period.",
                    ar: "تُستخدم الاعتمادات لتحميل الموارد المتميزة من المنصات المدعومة. كل تحميل يكلف عادة اعتماد واحد، بغض النظر عن نوع الملف (صور، رسوم متجهة، فيديوهات، أو قوالب). اعتماداتك صالحة طوال فترة اشتراكك.",
                  },
                  icon: CreditCardIcon,
                },
                {
                  id: "supported-platforms",
                  question: {
                    en: "Which creative platforms are supported?",
                    ar: "ما هي المنصات الإبداعية المدعومة؟",
                  },
                  answer: {
                    en: "We support major creative platforms including Freepik, Shutterstock, Adobe Stock, Getty Images, Unsplash, and many more. The number of supported platforms varies by subscription plan.",
                    ar: "نحن ندعم المنصات الإبداعية الرئيسية بما في ذلك Freepik و Shutterstock و Adobe Stock و Getty Images و Unsplash والعديد من المنصات الأخرى. عدد المنصات المدعومة يختلف حسب خطة الاشتراك.",
                  },
                  icon: Globe,
                },
                {
                  id: "download-process",
                  question: {
                    en: "How do I download resources from the platform?",
                    ar: "كيف أقوم بتحميل الموارد من المنصة؟",
                  },
                  answer: {
                    en: "Simply search for the content you need, select the resource you want, and click download. The system will automatically use one credit from your account and provide you with the high-quality file.",
                    ar: "ببساطة ابحث عن المحتوى الذي تحتاجه، اختر المورد الذي تريده، وانقر على تحميل. سيستخدم النظام تلقائياً اعتماد واحد من حسابك ويوفر لك الملف عالي الجودة.",
                  },
                  icon: Download,
                },
                {
                  id: "legal-usage",
                  question: {
                    en: "Is it safe and legal to use these resources?",
                    ar: "هل من الآمن والقانوني استخدام هذه الموارد؟",
                  },
                  answer: {
                    en: "Yes, absolutely! All resources available through our platform are legally licensed and safe to use for commercial and personal projects. We maintain partnerships with content creators and platforms.",
                    ar: "نعم، بالطبع! جميع الموارد المتاحة من خلال منصتنا مرخصة قانونياً وآمنة للاستخدام في المشاريع التجارية والشخصية. نحن نحتفظ بشراكات مع منشئي المحتوى والمنصات.",
                  },
                  icon: Shield,
                },
              ].map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-none"
                >
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <faq.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span
                          className={`font-semibold text-foreground text-left ${isRTL ? "font-tajawal" : "font-sans"}`}
                        >
                          {isRTL ? faq.question.ar : faq.question.en}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 shadow-xl">
                      <div
                        className={`${isRTL ? "mr-14 font-tajawal" : "ml-14 font-sans"} text-muted-foreground leading-relaxed`}
                      >
                        {isRTL ? faq.answer.ar : faq.answer.en}
                      </div>

                      {/* Feedback Section */}
                      {!feedbackGiven.has(faq.id) && (
                        <div
                          className={`${isRTL ? "mr-14" : "ml-14"} mt-6 pt-4 border-t border-border/50`}
                        >
                          <p
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("helpCenter.feedback.title")}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFeedback(faq.id, true)}
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800 dark:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.yes")}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFeedback(faq.id, false)}
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.no")}
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact Support Cards */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>
          <div className="container mx-auto max-w-4xl px-4 sm:px-5 relative z-10 text-center">
            <div className="mb-12 lg:mb-16">
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight ${isRTL ? "font-tajawal" : "font-sans"}`}
              >
                {t("helpCenter.contact.title")}
              </h2>
              <p
                className={`text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isRTL ? "font-tajawal font-medium" : "font-sans"}`}
              >
                {t("helpCenter.contact.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Email Support */}
              <Card className="group bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h3
                    className={`text-xl font-semibold text-foreground mb-2 ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("helpCenter.contact.methods.email.title")}
                  </h3>
                  <p
                    className={`text-muted-foreground mb-4 text-sm ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("helpCenter.contact.methods.email.description")}
                  </p>
                  <p
                    className={`text-xs text-muted-foreground mb-6 ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("helpCenter.contact.methods.email.responseTime")}
                  </p>
                  <Button
                    className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("helpCenter.contact.methods.email.action")}
                  </Button>
                </CardContent>
              </Card>

              {/* Live Chat */}
              <Card className="group bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3
                    className={`text-xl font-semibold text-foreground mb-2 ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("helpCenter.contact.methods.chat.title")}
                  </h3>
                  <p
                    className={`text-muted-foreground mb-4 text-sm ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("helpCenter.contact.methods.chat.description")}
                  </p>
                  <p
                    className={`text-xs text-muted-foreground mb-6 ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("helpCenter.contact.methods.chat.availability")}
                  </p>
                  <Button
                    className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("helpCenter.contact.methods.chat.action")}
                  </Button>
                </CardContent>
              </Card>

              {/* Phone Support */}
              <Card className="group bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <h3
                    className={`text-xl font-semibold text-foreground mb-2 ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("helpCenter.contact.methods.phone.title")}
                  </h3>
                  <p
                    className={`text-muted-foreground mb-4 text-sm ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("helpCenter.contact.methods.phone.description")}
                  </p>
                  <p
                    className={`text-xs text-muted-foreground mb-6 ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("helpCenter.contact.methods.phone.hours")}
                  </p>
                  <Button
                    className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground ${isRTL ? "font-tajawal" : "font-sans"}`}
                  >
                    {t("helpCenter.contact.methods.phone.action")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
