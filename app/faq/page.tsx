"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/components/i18n-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  HelpCircle,
  Sparkles,
  CreditCard,
  Download,
  Shield,
  Users,
  Settings,
  AlertTriangle,
  Globe,
  Headphones,
  FileText,
  Zap,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import Link from "next/link";
import { HeaderControls } from "@/components/header-controls";
import Footer from "@/components/footer";

// FAQ Skeleton Component
function FAQSkeleton() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
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
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-100"></div>

      {/* Hero Section Skeleton */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl px-4 sm:px-5 relative z-10">
          <div className="text-center mb-12 lg:mb-16">
            <Skeleton className="h-12 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>
      </section>

      {/* FAQ Items Skeleton */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-5">
          <div className="space-y-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6"
              >
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function FAQPage() {
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
    } catch {
      toast.error("Failed to submit feedback", {
        description: "Please try again later.",
        duration: 3000,
      });
    }
  };

  // Show loading skeleton while language data is loading
  if (isLoading) {
    return <FAQSkeleton />;
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

        {/* Floating Icons */}
        <div
          className={`absolute top-32 ${isRTL ? "left-8" : "right-8"} opacity-40`}
        >
          <div className="w-12 h-12 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center animate-float">
            <HelpCircle className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div
          className={`absolute top-96 ${isRTL ? "right-16" : "left-16"} opacity-30`}
        >
          <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center animate-float-delayed">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div
          className={`absolute bottom-96 ${isRTL ? "left-12" : "right-12"} opacity-35`}
        >
          <div className="w-14 h-14 bg-primary/10 border border-primary/10 rounded-2xl flex items-center justify-center animate-float">
            <FileText className="w-7 h-7 text-primary" />
          </div>
        </div>

        {/* Additional floating elements */}
        <div
          className={`absolute top-64 ${isRTL ? "left-1/4" : "right-1/4"} opacity-25`}
        >
          <div className="w-8 h-8 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center animate-float-slow">
            <Globe className="w-4 h-4 text-primary" />
          </div>
        </div>

        <div
          className={`absolute bottom-64 ${isRTL ? "right-1/3" : "left-1/3"} opacity-30`}
        >
          <div className="w-11 h-11 bg-primary/10 border border-primary/10 rounded-xl flex items-center justify-center animate-float-delayed">
            <Shield className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Diamond Pattern */}
        <div
          className={`absolute top-40 ${isRTL ? "left-1/6" : "right-1/6"} opacity-20`}
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="none"
            className="text-primary/35"
          >
            {Array.from({ length: 3 }, (_, row) =>
              Array.from({ length: 3 }, (_, col) => (
                <rect
                  key={`diamond-${row}-${col}`}
                  x={8 + col * 14}
                  y={8 + row * 14}
                  width="3"
                  height="3"
                  transform={`rotate(45 ${9.5 + col * 14} ${9.5 + row * 14})`}
                  fill="currentColor"
                  className="animate-pulse-slow"
                  style={{
                    animationDelay: `${(row + col) * 0.25}s`,
                    opacity: Math.random() * 0.4 + 0.3,
                  }}
                />
              ))
            )}
          </svg>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-100"></div>

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
        {/* Hero Section */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-primary/20 via-primary/5 to-primary/20 relative overflow-hidden">
          <div className="container mx-auto max-w-4xl px-4 sm:px-5 text-center">
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight ${isRTL ? "font-tajawal" : "font-sans"}`}
              role="heading"
              aria-level={1}
            >
              {isRTL ? (
                t("faq.title.ar", {
                  defaultValue: "الأسئلة الشائعة",
                })
              ) : (
                <>
                  {t("faq.title", {
                    defaultValue: "Frequently Asked ",
                  })}
                  <span className="bg-gradient-to-r mx-3 from-primary to-primary/70 bg-clip-text text-transparent">
                    {t("faq.titleHighlight", {
                      defaultValue: "Questions",
                    })}
                  </span>
                </>
              )}
            </h1>
            <p
              className={`text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isRTL && "font-medium font-tajawal"}`}
            >
              {t("faq.description", {
                defaultValue:
                  "Find answers to the most common questions about our platform and services.",
              })}
            </p>
          </div>
        </section>

        {/* FAQ Content Section */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-secondary via-secondary/50 to-secondary relative overflow-hidden">
          <div className="container mx-auto max-w-4xl px-4 sm:px-5 relative z-10">
            {/* FAQ Accordion */}
            <div
              className="space-y-4"
              role="region"
              aria-label="Frequently Asked Questions"
            >
              <Accordion
                type="single"
                collapsible
                className="w-full space-y-5"
                aria-label="FAQ Accordion"
              >
                {/* Question 1: What is Resource Hub? */}
                <AccordionItem
                  value="what-is-resource-hub"
                  className="border-none"
                >
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <span
                          className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-right" : "font-sans"}`}
                        >
                          {t("faq.questions.whatIsResourceHub.question", {
                            defaultValue:
                              "What is Resource Hub and how does it work?",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p
                        className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-right" : ""}`}
                      >
                        {t("faq.questions.whatIsResourceHub.answer", {
                          defaultValue:
                            "Resource Hub is a premium platform that provides access to millions of high-quality creative resources from top platforms like Freepik, Shutterstock, Adobe Stock, and more. We offer a credit-based system where you can download premium content using credits from your subscription plan.",
                        })}
                      </p>

                      {/* Feedback Section */}
                      {!feedbackGiven.has("what-is-resource-hub") && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <p
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("helpCenter.feedback.title", {
                              defaultValue: "Was this helpful?",
                            })}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("what-is-resource-hub", true)
                              }
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800 dark:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.yes", {
                                  defaultValue: "Yes",
                                })}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("what-is-resource-hub", false)
                              }
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.no", {
                                  defaultValue: "No",
                                })}
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>

                {/* Question 2: How do credits work? */}
                <AccordionItem value="how-credits-work" className="border-none">
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <span
                          className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-right" : "font-sans"}`}
                        >
                          {t("faq.questions.howCreditsWork.question", {
                            defaultValue:
                              "How do credits work and what can I download with them?",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p
                        className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-right" : ""}`}
                      >
                        {t("faq.questions.howCreditsWork.answer", {
                          defaultValue:
                            "Credits are used to download premium resources from supported platforms. Each download typically costs 1 credit, regardless of the file type (images, vectors, videos, or templates). Your credits are valid for the duration of your subscription period and can be used across all supported platforms.",
                        })}
                      </p>

                      {/* Feedback Section */}
                      {!feedbackGiven.has("how-credits-work") && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <p
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("helpCenter.feedback.title", {
                              defaultValue: "Was this helpful?",
                            })}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("how-credits-work", true)
                              }
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800 dark:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.yes", {
                                  defaultValue: "Yes",
                                })}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("how-credits-work", false)
                              }
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.no", {
                                  defaultValue: "No",
                                })}
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>

                {/* Question 3: Supported Platforms */}
                <AccordionItem
                  value="supported-platforms"
                  className="border-none"
                >
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <Globe className="w-5 h-5 text-primary" />
                        </div>
                        <span
                          className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-right" : "font-sans"}`}
                        >
                          {t("faq.questions.supportedPlatforms.question", {
                            defaultValue:
                              "Which creative platforms are supported?",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p
                        className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-right" : ""}`}
                      >
                        {t("faq.questions.supportedPlatforms.answer", {
                          defaultValue:
                            "We support major creative platforms including Freepik, Shutterstock, Adobe Stock, Getty Images, Unsplash, and many more. The number of supported platforms varies by subscription plan, with premium plans offering access to more platforms and exclusive content.",
                        })}
                      </p>

                      {/* Feedback Section */}
                      {!feedbackGiven.has("supported-platforms") && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <p
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("helpCenter.feedback.title", {
                              defaultValue: "Was this helpful?",
                            })}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("supported-platforms", true)
                              }
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800 dark:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.yes", {
                                  defaultValue: "Yes",
                                })}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("supported-platforms", false)
                              }
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.no", {
                                  defaultValue: "No",
                                })}
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>

                {/* Question 4: How to Download */}
                <AccordionItem value="how-to-download" className="border-none">
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <Download className="w-5 h-5 text-primary" />
                        </div>
                        <span
                          className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-right" : "font-sans"}`}
                        >
                          {t("faq.questions.howToDownload.question", {
                            defaultValue:
                              "How do I download resources from the platform?",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p
                        className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-right" : ""}`}
                      >
                        {t("faq.questions.howToDownload.answer", {
                          defaultValue:
                            "Simply search for the content you need, select the resource you want, and click download. The system will automatically use one credit from your account and provide you with the high-quality file. All downloads are instant and available in multiple formats when applicable.",
                        })}
                      </p>

                      {/* Feedback Section */}
                      {!feedbackGiven.has("how-to-download") && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <p
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("helpCenter.feedback.title", {
                              defaultValue: "Was this helpful?",
                            })}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("how-to-download", true)
                              }
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800 dark:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.yes", {
                                  defaultValue: "Yes",
                                })}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("how-to-download", false)
                              }
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.no", {
                                  defaultValue: "No",
                                })}
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>

                {/* Question 5: Safety and Legal */}
                <AccordionItem value="safety-legal" className="border-none">
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <span
                          className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-right" : "font-sans"}`}
                        >
                          {t("faq.questions.safetyLegal.question", {
                            defaultValue:
                              "Is it safe and legal to use these resources?",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p
                        className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-right" : ""}`}
                      >
                        {t("faq.questions.safetyLegal.answer", {
                          defaultValue:
                            "Yes, absolutely! All resources available through our platform are legally licensed and safe to use for commercial and personal projects. We maintain partnerships with content creators and platforms to ensure all downloads are legitimate and properly licensed.",
                        })}
                      </p>

                      {/* Feedback Section */}
                      {!feedbackGiven.has("safety-legal") && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <p
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("helpCenter.feedback.title", {
                              defaultValue: "Was this helpful?",
                            })}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("safety-legal", true)
                              }
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800 dark:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.yes", {
                                  defaultValue: "Yes",
                                })}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("safety-legal", false)
                              }
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.no", {
                                  defaultValue: "No",
                                })}
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>

                {/* Question 6: Music Restrictions */}
                <AccordionItem
                  value="music-restrictions"
                  className="border-none"
                >
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-5 h-5 text-primary" />
                        </div>
                        <span
                          className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-right" : "font-sans"}`}
                        >
                          {t("faq.questions.musicRestrictions.question", {
                            defaultValue:
                              "Can I download music or audio files from this platform?",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p
                        className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-right" : ""}`}
                      >
                        {t("faq.questions.musicRestrictions.answer", {
                          defaultValue:
                            "No, our platform does not support music downloads or any audio content. We strictly focus on visual creative resources such as images, vectors, graphics, and videos. Music downloads are prohibited due to copyright and licensing restrictions. For audio content, please use specialized music licensing platforms.",
                        })}
                      </p>

                      {/* Feedback Section */}
                      {!feedbackGiven.has("music-restrictions") && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <p
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("helpCenter.feedback.title", {
                              defaultValue: "Was this helpful?",
                            })}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("music-restrictions", true)
                              }
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800 dark:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.yes", {
                                  defaultValue: "Yes",
                                })}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("music-restrictions", false)
                              }
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.no", {
                                  defaultValue: "No",
                                })}
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>

                {/* Question 7: Pricing Plans */}
                <AccordionItem value="pricing-plans" className="border-none">
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <span
                          className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-right" : "font-sans"}`}
                        >
                          {t("faq.questions.pricingPlans.question", {
                            defaultValue:
                              "What pricing plans are available and what's included?",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p
                        className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-right" : ""}`}
                      >
                        {t("faq.questions.pricingPlans.answer", {
                          defaultValue:
                            "We offer flexible subscription plans ranging from basic to premium tiers. Each plan includes a specific number of monthly credits, access to different platforms, and various features. Premium plans offer more credits, access to exclusive content, priority support, and advanced features like bulk downloads and API access.",
                        })}
                      </p>

                      {/* Feedback Section */}
                      {!feedbackGiven.has("pricing-plans") && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <p
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("helpCenter.feedback.title", {
                              defaultValue: "Was this helpful?",
                            })}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("pricing-plans", true)
                              }
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800 dark:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.yes", {
                                  defaultValue: "Yes",
                                })}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("pricing-plans", false)
                              }
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.no", {
                                  defaultValue: "No",
                                })}
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>

                {/* Question 8: Account Management */}
                <AccordionItem
                  value="account-management"
                  className="border-none"
                >
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <span
                          className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-right" : "font-sans"}`}
                        >
                          {t("faq.questions.accountManagement.question", {
                            defaultValue:
                              "How do I manage my account and subscription?",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p
                        className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-right" : ""}`}
                      >
                        {t("faq.questions.accountManagement.answer", {
                          defaultValue:
                            "You can manage your account through your dashboard where you can view your credit balance, download history, update payment methods, change subscription plans, and modify account settings. You can also cancel or pause your subscription at any time without penalties.",
                        })}
                      </p>

                      {/* Feedback Section */}
                      {!feedbackGiven.has("account-management") && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <p
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("helpCenter.feedback.title", {
                              defaultValue: "Was this helpful?",
                            })}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("account-management", true)
                              }
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800 dark:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.yes", {
                                  defaultValue: "Yes",
                                })}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("account-management", false)
                              }
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.no", {
                                  defaultValue: "No",
                                })}
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>

                {/* Question 9: Technical Support */}
                <AccordionItem
                  value="technical-support"
                  className="border-none"
                >
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <Headphones className="w-5 h-5 text-primary" />
                        </div>
                        <span
                          className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-right" : "font-sans"}`}
                        >
                          {t("faq.questions.technicalSupport.question", {
                            defaultValue:
                              "What technical support options are available?",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p
                        className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-right" : ""}`}
                      >
                        {t("faq.questions.technicalSupport.answer", {
                          defaultValue:
                            "We provide 24/7 technical support through multiple channels including live chat, email support, and phone support for premium users. Our support team can help with account issues, download problems, billing questions, and technical troubleshooting. Response times vary by plan level.",
                        })}
                      </p>

                      {/* Feedback Section */}
                      {!feedbackGiven.has("technical-support") && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <p
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("helpCenter.feedback.title", {
                              defaultValue: "Was this helpful?",
                            })}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("technical-support", true)
                              }
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800 dark:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.yes", {
                                  defaultValue: "Yes",
                                })}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("technical-support", false)
                              }
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.no", {
                                  defaultValue: "No",
                                })}
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>

                {/* Question 10: File Formats */}
                <AccordionItem value="file-formats" className="border-none">
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <span
                          className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-right" : "font-sans"}`}
                        >
                          {t("faq.questions.fileFormats.question", {
                            defaultValue:
                              "What file formats are available for download?",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p
                        className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-right" : ""}`}
                      >
                        {t("faq.questions.fileFormats.answer", {
                          defaultValue:
                            "We support a wide range of file formats including JPG, PNG, SVG, EPS, AI, PSD, MP4, MOV, and more. The available formats depend on the original content and platform. Most resources are available in multiple formats and resolutions to suit different project needs.",
                        })}
                      </p>

                      {/* Feedback Section */}
                      {!feedbackGiven.has("file-formats") && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <p
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("helpCenter.feedback.title", {
                              defaultValue: "Was this helpful?",
                            })}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("file-formats", true)
                              }
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800 dark:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.yes", {
                                  defaultValue: "Yes",
                                })}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("file-formats", false)
                              }
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.no", {
                                  defaultValue: "No",
                                })}
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>

                {/* Question 11: Troubleshooting */}
                <AccordionItem value="troubleshooting" className="border-none">
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <Settings className="w-5 h-5 text-primary" />
                        </div>
                        <span
                          className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-right" : "font-sans"}`}
                        >
                          {t("faq.questions.troubleshooting.question", {
                            defaultValue:
                              "What should I do if downloads fail or I encounter errors?",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p
                        className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-right" : ""}`}
                      >
                        {t("faq.questions.troubleshooting.answer", {
                          defaultValue:
                            "If you experience download issues, first check your internet connection and try refreshing the page. Clear your browser cache and cookies if problems persist. For failed downloads, your credits will be automatically refunded. Contact our support team if issues continue, and we'll resolve them quickly.",
                        })}
                      </p>

                      {/* Feedback Section */}
                      {!feedbackGiven.has("troubleshooting") && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <p
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("helpCenter.feedback.title", {
                              defaultValue: "Was this helpful?",
                            })}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("troubleshooting", true)
                              }
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800 dark:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.yes", {
                                  defaultValue: "Yes",
                                })}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("troubleshooting", false)
                              }
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.no", {
                                  defaultValue: "No",
                                })}
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>

                {/* Question 12: Commercial Usage */}
                <AccordionItem value="commercial-usage" className="border-none">
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <span
                          className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-right" : "font-sans"}`}
                        >
                          {t("faq.questions.commercialUsage.question", {
                            defaultValue:
                              "Can I use downloaded resources for commercial projects?",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p
                        className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-right" : ""}`}
                      >
                        {t("faq.questions.commercialUsage.answer", {
                          defaultValue:
                            "Yes, all resources downloaded through our platform come with commercial usage rights. You can use them in client projects, marketing materials, websites, apps, and other commercial applications. However, you cannot resell or redistribute the original files as standalone products.",
                        })}
                      </p>

                      {/* Feedback Section */}
                      {!feedbackGiven.has("commercial-usage") && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <p
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("helpCenter.feedback.title", {
                              defaultValue: "Was this helpful?",
                            })}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("commercial-usage", true)
                              }
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800 dark:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.yes", {
                                  defaultValue: "Yes",
                                })}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("commercial-usage", false)
                              }
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.no", {
                                  defaultValue: "No",
                                })}
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>

                {/* Question 13: Refund Policy */}
                <AccordionItem value="refund-policy" className="border-none">
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <span
                          className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-right" : "font-sans"}`}
                        >
                          {t("faq.questions.refundPolicy.question", {
                            defaultValue:
                              "What is your refund and cancellation policy?",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p
                        className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-right" : ""}`}
                      >
                        {t("faq.questions.refundPolicy.answer", {
                          defaultValue:
                            "We offer a 30-day money-back guarantee for new subscriptions. You can cancel your subscription at any time, and it will remain active until the end of your billing period. Unused credits expire at the end of your subscription period, but we offer pro-rated refunds in certain circumstances.",
                        })}
                      </p>

                      {/* Feedback Section */}
                      {!feedbackGiven.has("refund-policy") && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <p
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("helpCenter.feedback.title", {
                              defaultValue: "Was this helpful?",
                            })}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("refund-policy", true)
                              }
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800 dark:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.yes", {
                                  defaultValue: "Yes",
                                })}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("refund-policy", false)
                              }
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.no", {
                                  defaultValue: "No",
                                })}
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>

                {/* Question 14: Platform Features */}
                <AccordionItem
                  value="platform-features"
                  className="border-none"
                >
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/90 transition-all duration-300 overflow-hidden">
                    <AccordionTrigger className="px-6 py-6 hover:no-underline cursor-pointer">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <span
                          className={`text-lg font-semibold text-foreground ${isRTL ? "font-tajawal text-right" : "font-sans"}`}
                        >
                          {t("faq.questions.platformFeatures.question", {
                            defaultValue:
                              "What advanced features does the platform offer?",
                          })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <p
                        className={`text-muted-foreground leading-relaxed ${isRTL ? "font-tajawal text-right" : ""}`}
                      >
                        {t("faq.questions.platformFeatures.answer", {
                          defaultValue:
                            "Our platform includes advanced search filters, collections and favorites, download history tracking, bulk download capabilities, API access for developers, team collaboration tools, and integration with popular design software. Premium users get access to exclusive features and priority processing.",
                        })}
                      </p>

                      {/* Feedback Section */}
                      {!feedbackGiven.has("platform-features") && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <p
                            className={`text-sm font-medium text-foreground mb-3 ${isRTL ? "font-tajawal" : "font-sans"}`}
                          >
                            {t("helpCenter.feedback.title", {
                              defaultValue: "Was this helpful?",
                            })}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("platform-features", true)
                              }
                              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 dark:bg-green-950 dark:hover:bg-green-900 dark:border-green-800 dark:text-green-300"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.yes", {
                                  defaultValue: "Yes",
                                })}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleFeedback("platform-features", false)
                              }
                              className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 dark:bg-red-950 dark:hover:bg-red-900 dark:border-red-800 dark:text-red-300"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              <span
                                className={isRTL ? "font-tajawal" : "font-sans"}
                              >
                                {t("helpCenter.feedback.no", {
                                  defaultValue: "No",
                                })}
                              </span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
