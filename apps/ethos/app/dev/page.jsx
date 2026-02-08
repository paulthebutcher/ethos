"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// Simple markdown-ish rendering for code blocks
function formatMessage(text) {
  if (!text) return null;

  // Split by code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
      const lang = match?.[1] || "";
      const code = match?.[2] || part.slice(3, -3);
      return (
        <pre
          key={i}
          className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm my-3 font-mono"
        >
          {lang && (
            <div className="text-xs text-slate-500 mb-2 uppercase">{lang}</div>
          )}
          <code>{code}</code>
        </pre>
      );
    }

    // Handle inline code
    const inlineParts = part.split(/(`[^`]+`)/g);
    return (
      <span key={i}>
        {inlineParts.map((inline, j) => {
          if (inline.startsWith("`") && inline.endsWith("`")) {
            return (
              <code
                key={j}
                className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono"
              >
                {inline.slice(1, -1)}
              </code>
            );
          }
          // Handle newlines
          return inline.split("\n").map((line, k, arr) => (
            <span key={`${j}-${k}`}>
              {line}
              {k < arr.length - 1 && <br />}
            </span>
          ));
        })}
      </span>
    );
  });
}

export default function DevAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [authInput, setAuthInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check for stored token
  useEffect(() => {
    const stored = localStorage.getItem("dev_auth_token");
    if (stored) {
      setAuthToken(stored);
      setIsAuthenticated(true);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input after loading
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      inputRef.current?.focus();
    }
  }, [isLoading, isAuthenticated]);

  const handleAuth = (e) => {
    e.preventDefault();
    localStorage.setItem("dev_auth_token", authInput);
    setAuthToken(authInput);
    setIsAuthenticated(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Build conversation for API
      const apiMessages = [
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: "user", content: userMessage },
      ];

      const res = await fetch("/dev/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem("dev_auth_token");
          throw new Error("Authentication failed. Please re-enter your token.");
        }
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          toolsUsed: data.toolsUsed,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error.message}`,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick action buttons
  const quickActions = [
    { label: "📁 List files", prompt: "List the files in the ethos/app directory" },
    { label: "📊 Git status", prompt: "What's the current git status?" },
    { label: "🔍 Search", prompt: "Search for " },
    { label: "🏗️ Build", prompt: "Run a build for ethos to check for errors" },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔐</div>
              <h1 className="text-xl font-bold text-slate-900">Dev Assistant</h1>
              <p className="text-sm text-slate-500 mt-1">Enter your access token</p>
            </div>
            <form onSubmit={handleAuth}>
              <input
                type="password"
                value={authInput}
                onChange={(e) => setAuthInput(e.target.value)}
                placeholder="Access token"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent mb-4"
                autoFocus
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                Unlock
              </button>
            </form>
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">
            <Link href="/" className="hover:text-slate-600">
              ← Back to AI Ethos
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="font-semibold text-slate-900">Dev Assistant</h1>
            <p className="text-xs text-slate-500">AI Ethos Codebase</p>
          </div>
        </div>
        <button
          onClick={() => {
            setMessages([]);
          }}
          className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100"
        >
          Clear
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">👨‍💻</div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              What would you like to work on?
            </h2>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              I can read and edit files, search code, run builds, and handle git operations.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (action.prompt.endsWith(" ")) {
                      setInput(action.prompt);
                      inputRef.current?.focus();
                    } else {
                      setInput(action.prompt);
                      // Auto-submit
                      setTimeout(() => {
                        document.querySelector("form")?.requestSubmit();
                      }, 0);
                    }
                  }}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-700 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-sky-500 text-white"
                  : message.isError
                  ? "bg-red-50 border border-red-200 text-red-800"
                  : "bg-white border border-slate-200 text-slate-800"
              }`}
            >
              {message.role === "assistant" && message.toolsUsed?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {message.toolsUsed.map((tool, j) => (
                    <span
                      key={j}
                      className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.role === "user"
                  ? message.content
                  : formatMessage(message.content)}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-slate-500">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-sm">Working...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to read, edit, or search code..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50 disabled:bg-slate-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
