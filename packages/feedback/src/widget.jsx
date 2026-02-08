"use client";

import { useState, useRef, useEffect } from "react";

/**
 * Feedback Widget - A floating button that opens a feedback form
 *
 * @param {Object} props
 * @param {string} props.appSlug - The app identifier
 * @param {string} props.color - Brand color for styling
 * @param {string} props.position - "bottom-right" | "bottom-left"
 * @param {string} props.apiEndpoint - Custom API endpoint (default: /api/feedback)
 * @param {string} props.userId - Optional user ID for authenticated feedback
 * @param {string} props.userEmail - Optional user email
 */
export function FeedbackWidget({
  appSlug,
  color = "#0ea5e9",
  position = "bottom-right",
  apiEndpoint = "/api/feedback",
  userId,
  userEmail,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("general");
  const [status, setStatus] = useState("idle"); // idle, sending, success, error
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  // Focus textarea when opening
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // Reset on close
  const handleClose = () => {
    setIsOpen(false);
    if (status === "success") {
      setMessage("");
      setType("general");
      setStatus("idle");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("sending");
    setError(null);

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appSlug,
          message: message.trim(),
          type,
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          userId,
          userEmail,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit feedback");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  };

  const positionClasses =
    position === "bottom-left" ? "left-4" : "right-4";

  const feedbackTypes = [
    { value: "general", label: "💬 General" },
    { value: "bug", label: "🐛 Bug" },
    { value: "feature", label: "✨ Feature" },
    { value: "praise", label: "❤️ Praise" },
  ];

  return (
    <div className={`fixed bottom-4 ${positionClasses} z-50`}>
      {/* Feedback Form */}
      {isOpen && (
        <div
          className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
          style={{ marginBottom: "8px" }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 text-white"
            style={{ backgroundColor: color }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">Send Feedback</span>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {status === "success" ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">🎉</div>
                <p className="font-medium text-slate-900">Thanks!</p>
                <p className="text-sm text-slate-500">
                  Your feedback has been received.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-4 text-sm text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Type selector */}
                <div className="flex gap-1 mb-3">
                  {feedbackTypes.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setType(t.value)}
                      className={`flex-1 px-2 py-1.5 text-xs rounded-lg border transition-colors ${
                        type === t.value
                          ? "border-slate-400 bg-slate-100"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Message */}
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:outline-none focus:border-slate-400"
                  disabled={status === "sending"}
                />

                {/* Error */}
                {status === "error" && (
                  <p className="text-xs text-red-600 mt-2">
                    {error || "Something went wrong. Please try again."}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!message.trim() || status === "sending"}
                  className="w-full mt-3 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                  style={{ backgroundColor: color }}
                >
                  {status === "sending" ? "Sending..." : "Send Feedback"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
        style={{ backgroundColor: color }}
        title={isOpen ? "Close" : "Send Feedback"}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}

export default FeedbackWidget;
