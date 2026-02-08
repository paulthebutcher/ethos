"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// Simple markdown-ish rendering for code blocks
function formatMessage(text) {
  if (!text) return null;

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

// File Tree Component
function FileTree({ onSelect, authToken }) {
  const [tree, setTree] = useState(null);
  const [expanded, setExpanded] = useState({ "": true });
  const [loading, setLoading] = useState(true);

  const loadDirectory = async (path = "") => {
    try {
      const res = await fetch("/dev/api/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ path }),
      });
      const data = await res.json();
      return data.files || [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    loadDirectory().then((files) => {
      setTree({ "": files });
      setLoading(false);
    });
  }, [authToken]);

  const toggleDir = async (path) => {
    if (expanded[path]) {
      setExpanded((prev) => ({ ...prev, [path]: false }));
    } else {
      if (!tree[path]) {
        const files = await loadDirectory(path);
        setTree((prev) => ({ ...prev, [path]: files }));
      }
      setExpanded((prev) => ({ ...prev, [path]: true }));
    }
  };

  const renderItems = (items, parentPath = "") => {
    if (!items) return null;
    return items.map((item) => {
      const fullPath = parentPath ? `${parentPath}/${item.name}` : item.name;
      const isDir = item.type === "dir";
      return (
        <div key={fullPath}>
          <button
            onClick={() => (isDir ? toggleDir(fullPath) : onSelect(fullPath))}
            className="w-full text-left px-2 py-1 text-xs hover:bg-slate-100 rounded flex items-center gap-1 truncate"
          >
            <span className="flex-shrink-0">
              {isDir ? (expanded[fullPath] ? "📂" : "📁") : "📄"}
            </span>
            <span className="truncate">{item.name}</span>
          </button>
          {isDir && expanded[fullPath] && (
            <div className="ml-3 border-l border-slate-200">
              {renderItems(tree[fullPath], fullPath)}
            </div>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return <div className="p-4 text-xs text-slate-400">Loading...</div>;
  }

  return (
    <div className="p-2 text-slate-700 overflow-y-auto">
      {renderItems(tree[""])}
    </div>
  );
}

// Voice Input Component
function VoiceInput({ onTranscript, disabled }) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        onTranscript(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!recognitionRef.current && typeof window !== "undefined") {
    return null; // Browser doesn't support speech recognition
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      className={`p-3 rounded-xl transition-colors ${
        isListening
          ? "bg-red-500 text-white animate-pulse"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      } disabled:opacity-50`}
      title={isListening ? "Stop listening" : "Voice input"}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    </button>
  );
}

const STORAGE_KEY = "dev_assistant_history";
const TOKEN_KEY = "dev_auth_token";

export default function DevAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [authInput, setAuthInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentTool, setCurrentTool] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load stored token and history
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setAuthToken(stored);
      setIsAuthenticated(true);
    }
    const history = localStorage.getItem(STORAGE_KEY);
    if (history) {
      try {
        setMessages(JSON.parse(history));
      } catch {
        // Invalid history, ignore
      }
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50))); // Keep last 50
    }
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentTool]);

  // Focus input after loading
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      inputRef.current?.focus();
    }
  }, [isLoading, isAuthenticated]);

  const handleAuth = (e) => {
    e.preventDefault();
    localStorage.setItem(TOKEN_KEY, authInput);
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
    setCurrentTool(null);

    try {
      const apiMessages = [
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: "user", content: userMessage },
      ];

      // Use streaming API
      const res = await fetch("/dev/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ messages: apiMessages, stream: true }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem(TOKEN_KEY);
          throw new Error("Authentication failed. Please re-enter your token.");
        }
        const data = await res.json();
        throw new Error(data.error || `Request failed: ${res.status}`);
      }

      // Handle SSE stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamedContent = "";
      let toolsUsed = [];

      // Add empty assistant message to stream into
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", toolsUsed: [], isStreaming: true },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            const eventType = line.slice(7);
            continue;
          }
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.text) {
                streamedContent += data.text;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastIdx = newMessages.length - 1;
                  newMessages[lastIdx] = {
                    ...newMessages[lastIdx],
                    content: streamedContent,
                  };
                  return newMessages;
                });
              } else if (data.tool) {
                setCurrentTool(data.tool);
                if (!toolsUsed.includes(data.tool)) {
                  toolsUsed.push(data.tool);
                }
              } else if (data.toolsUsed) {
                toolsUsed = data.toolsUsed;
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }

      // Finalize the message
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastIdx = newMessages.length - 1;
        newMessages[lastIdx] = {
          ...newMessages[lastIdx],
          content: streamedContent || "No response",
          toolsUsed,
          isStreaming: false,
        };
        return newMessages;
      });
    } catch (error) {
      setMessages((prev) => {
        // Remove streaming message if it exists
        const filtered = prev.filter((m) => !m.isStreaming);
        return [
          ...filtered,
          {
            role: "assistant",
            content: `Error: ${error.message}`,
            isError: true,
          },
        ];
      });
    } finally {
      setIsLoading(false);
      setCurrentTool(null);
    }
  };

  const handleFileSelect = (path) => {
    setInput(`Read the file at ${path}`);
    inputRef.current?.focus();
    setShowSidebar(false);
  };

  const handleVoiceTranscript = useCallback((transcript) => {
    setInput(transcript);
  }, []);

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const quickActions = [
    { label: "📁 List apps", prompt: "List the apps directory to see all apps" },
    { label: "📦 Packages", prompt: "List the packages directory to see shared code" },
    { label: "📝 Commits", prompt: "Show me the 5 most recent commits" },
    { label: "🔍 Search", prompt: "Search for " },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🛠️</div>
              <h1 className="text-2xl font-bold text-white">Dev Assistant</h1>
              <p className="text-sm text-slate-300 mt-1">AI Ethos Development Tool</p>
            </div>
            <form onSubmit={handleAuth}>
              <input
                type="password"
                value={authInput}
                onChange={(e) => setAuthInput(e.target.value)}
                placeholder="Access token"
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent mb-4"
                autoFocus
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors"
              >
                Unlock
              </button>
            </form>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">
            <Link href="/" className="hover:text-slate-300">
              ← Back to AI Ethos
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900 text-sm">File Explorer</h2>
          <button
            onClick={() => setShowSidebar(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <FileTree onSelect={handleFileSelect} authToken={authToken} />
      </div>

      {/* Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden text-slate-400 hover:text-slate-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
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
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => {
                setIsAuthenticated(false);
                localStorage.removeItem(TOKEN_KEY);
              }}
              className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛠️</div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                What would you like to build?
              </h2>
              <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                I can read and edit files, search code, view history, and create PRs.
                Every edit commits directly to GitHub.
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
                    : "bg-white border border-slate-200 text-slate-800 shadow-sm"
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
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
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
                  <span className="text-sm">
                    {currentTool ? `Running ${currentTool}...` : "Thinking..."}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />
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
    </div>
  );
}
