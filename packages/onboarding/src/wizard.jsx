"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Onboarding Wizard Component
 * A step-by-step wizard for guiding users through app setup
 *
 * @param {Object} props
 * @param {Array} props.steps - Array of step objects
 * @param {string} props.appSlug - App identifier
 * @param {string} props.userId - User identifier
 * @param {string} props.color - Brand color
 * @param {Function} props.onComplete - Called when onboarding completes
 * @param {Function} props.onSkip - Called when user skips onboarding
 * @param {Function} props.onStepComplete - Called when a step completes
 * @param {string} props.apiEndpoint - Custom API endpoint for progress tracking
 *
 * Step object shape:
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   icon: string (emoji),
 *   component: React.Component (optional - custom step content),
 *   action: { label: string, href: string } (optional - action button),
 *   validation: () => boolean (optional - check if step is complete),
 * }
 */
export function OnboardingWizard({
  steps = [],
  appSlug,
  userId,
  color = "#0ea5e9",
  onComplete,
  onSkip,
  onStepComplete,
  apiEndpoint = "/api/onboarding",
  initialStep = 0,
  showProgress = true,
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  // Load saved progress on mount
  useEffect(() => {
    if (userId && appSlug) {
      loadProgress();
    }
  }, [userId, appSlug]);

  const loadProgress = async () => {
    try {
      const res = await fetch(`${apiEndpoint}?app=${appSlug}&user=${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.progress) {
          setCurrentStep(data.progress.currentStep || 0);
          setCompletedSteps(data.progress.completedSteps || []);
        }
      }
    } catch (error) {
      console.error("Failed to load onboarding progress:", error);
    }
  };

  const saveProgress = async (stepIndex, completed) => {
    if (!userId || !appSlug) return;

    try {
      await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appSlug,
          userId,
          currentStep: stepIndex,
          completedSteps: completed,
          isComplete: stepIndex >= steps.length - 1 && completed.includes(stepIndex),
        }),
      });
    } catch (error) {
      console.error("Failed to save onboarding progress:", error);
    }
  };

  const handleNext = useCallback(async () => {
    setIsLoading(true);

    // Mark current step as complete
    const newCompleted = [...completedSteps];
    if (!newCompleted.includes(currentStep)) {
      newCompleted.push(currentStep);
    }
    setCompletedSteps(newCompleted);

    // Callback
    if (onStepComplete) {
      onStepComplete(currentStep, step);
    }

    if (isLastStep) {
      // Complete onboarding
      await saveProgress(currentStep, newCompleted);
      if (onComplete) {
        onComplete();
      }
    } else {
      // Move to next step
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      await saveProgress(nextStep, newCompleted);
    }

    setIsLoading(false);
  }, [currentStep, completedSteps, isLastStep, step, onComplete, onStepComplete]);

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    if (onSkip) {
      onSkip();
    }
    if (userId && appSlug) {
      await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appSlug,
          userId,
          skipped: true,
        }),
      });
    }
  };

  const goToStep = (index) => {
    // Only allow going to completed steps or the next uncompleted one
    if (index <= Math.max(...completedSteps, -1) + 1) {
      setCurrentStep(index);
    }
  };

  if (!step) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-w-2xl mx-auto">
      {/* Progress bar */}
      {showProgress && (
        <div className="h-1 bg-slate-100">
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: color }}
          />
        </div>
      )}

      {/* Step indicators */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <button
              key={s.id || i}
              onClick={() => goToStep(i)}
              className={`flex items-center gap-2 ${
                i <= Math.max(...completedSteps, -1) + 1
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  i === currentStep
                    ? "text-white"
                    : completedSteps.includes(i)
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-500"
                }`}
                style={i === currentStep ? { backgroundColor: color } : {}}
              >
                {completedSteps.includes(i) ? "✓" : i + 1}
              </div>
              <span
                className={`hidden sm:inline text-sm ${
                  i === currentStep
                    ? "font-medium text-slate-900"
                    : "text-slate-500"
                }`}
              >
                {s.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">{step.icon || "📋"}</div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            {step.title}
          </h2>
          <p className="text-slate-600">{step.description}</p>
        </div>

        {/* Custom step component */}
        {step.component && (
          <div className="my-6">{step.component}</div>
        )}

        {/* Action button */}
        {step.action && (
          <div className="mb-6 text-center">
            <a
              href={step.action.href}
              target={step.action.external ? "_blank" : undefined}
              rel={step.action.external ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {step.action.label}
              {step.action.external && <span>↗</span>}
            </a>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Back
            </button>
          ) : (
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Skip for now
            </button>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={isLoading}
          className="px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
          style={{ backgroundColor: color }}
        >
          {isLoading
            ? "..."
            : isLastStep
              ? "Complete Setup"
              : "Continue →"}
        </button>
      </div>
    </div>
  );
}

/**
 * Onboarding Card - A simpler, inline onboarding prompt
 * Use when you want a less intrusive onboarding experience
 */
export function OnboardingCard({
  title = "Welcome!",
  description = "Let's get you set up.",
  ctaLabel = "Start Setup",
  onStart,
  onSkip,
  color = "#0ea5e9",
}) {
  return (
    <div
      className="rounded-xl p-6 text-white"
      style={{ backgroundColor: color }}
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-white/80 mb-4">{description}</p>
      <div className="flex gap-3">
        <button
          onClick={onStart}
          className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
        >
          {ctaLabel} →
        </button>
        {onSkip && (
          <button
            onClick={onSkip}
            className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}

export default OnboardingWizard;
