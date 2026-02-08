import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// GitHub config
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || "paulthebutcher";
const GITHUB_REPO = process.env.GITHUB_REPO || "ethos";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

// GitHub API helper
async function githubAPI(endpoint, options = {}) {
  const url = `https://api.github.com${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GitHub API error: ${res.status} - ${error}`);
  }

  return res.json();
}

// Define tools for Claude
const tools = [
  {
    name: "list_files",
    description:
      "List files and directories at a given path in the GitHub repository.",
    input_schema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description:
            "Path relative to repo root. Use empty string or '.' for root.",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "read_file",
    description: "Read the contents of a file from the GitHub repository.",
    input_schema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to the file relative to repo root",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "write_file",
    description:
      "Create or update a file in the GitHub repository. This creates a commit.",
    input_schema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to the file relative to repo root",
        },
        content: {
          type: "string",
          description: "The content to write to the file",
        },
        message: {
          type: "string",
          description: "Commit message describing the change",
        },
      },
      required: ["path", "content", "message"],
    },
  },
  {
    name: "search_code",
    description: "Search for code patterns across the repository using GitHub code search.",
    input_schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (code pattern to find)",
        },
        path: {
          type: "string",
          description: "Optional path filter (e.g., 'guildry/apps/ethos' to search only in that app)",
        },
        extension: {
          type: "string",
          description: "Optional file extension filter (e.g., 'jsx', 'ts')",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_recent_commits",
    description: "Get recent commits to see what has changed.",
    input_schema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Optional path to filter commits by",
        },
        count: {
          type: "number",
          description: "Number of commits to fetch (default 10)",
        },
      },
    },
  },
  {
    name: "get_file_history",
    description: "Get the commit history for a specific file.",
    input_schema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "Path to the file",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "create_branch",
    description: "Create a new branch from the current main branch.",
    input_schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name for the new branch",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "create_pull_request",
    description: "Create a pull request from a branch to main.",
    input_schema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "PR title",
        },
        body: {
          type: "string",
          description: "PR description",
        },
        head: {
          type: "string",
          description: "Branch name to merge from",
        },
      },
      required: ["title", "head"],
    },
  },
  {
    name: "trigger_deploy",
    description:
      "Trigger a Vercel deployment by creating an empty commit (useful after multiple file changes).",
    input_schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Deploy commit message",
        },
      },
    },
  },
];

// Tool implementations
async function listFiles(input) {
  try {
    const path = input.path === "." || !input.path ? "" : input.path;
    const data = await githubAPI(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`
    );

    if (!Array.isArray(data)) {
      return `${path} is a file, not a directory`;
    }

    return data
      .map((item) => `${item.type === "dir" ? "📁" : "📄"} ${item.name}`)
      .join("\n");
  } catch (error) {
    return `Error listing files: ${error.message}`;
  }
}

async function readFile(input) {
  try {
    const data = await githubAPI(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${input.path}?ref=${GITHUB_BRANCH}`
    );

    if (data.type !== "file") {
      return `${input.path} is not a file`;
    }

    // Decode base64 content
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return content;
  } catch (error) {
    return `Error reading file: ${error.message}`;
  }
}

async function writeFile(input) {
  try {
    // First, try to get the current file to get its SHA (needed for updates)
    let sha;
    try {
      const existing = await githubAPI(
        `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${input.path}?ref=${GITHUB_BRANCH}`
      );
      sha = existing.sha;
    } catch {
      // File doesn't exist yet, that's fine
    }

    // Create or update the file
    const body = {
      message: input.message || `Update ${input.path}`,
      content: Buffer.from(input.content).toString("base64"),
      branch: GITHUB_BRANCH,
    };

    if (sha) {
      body.sha = sha;
    }

    await githubAPI(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${input.path}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    return `✅ Successfully ${sha ? "updated" : "created"} ${input.path}\nCommit: "${input.message}"`;
  } catch (error) {
    return `Error writing file: ${error.message}`;
  }
}

async function searchCode(input) {
  try {
    let query = `${input.query} repo:${GITHUB_OWNER}/${GITHUB_REPO}`;
    if (input.path) {
      query += ` path:${input.path}`;
    }
    if (input.extension) {
      query += ` extension:${input.extension}`;
    }

    const data = await githubAPI(
      `/search/code?q=${encodeURIComponent(query)}&per_page=20`
    );

    if (data.total_count === 0) {
      return "No matches found";
    }

    return data.items
      .map((item) => `📄 ${item.path}`)
      .join("\n") + `\n\n(${data.total_count} total matches)`;
  } catch (error) {
    // GitHub code search has rate limits, fallback to a simpler approach
    return `Search error (may be rate limited): ${error.message}. Try reading specific files instead.`;
  }
}

async function getRecentCommits(input) {
  try {
    let url = `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?sha=${GITHUB_BRANCH}&per_page=${input.count || 10}`;
    if (input.path) {
      url += `&path=${input.path}`;
    }

    const data = await githubAPI(url);

    return data
      .map((commit) => {
        const date = new Date(commit.commit.author.date).toLocaleDateString();
        const msg = commit.commit.message.split("\n")[0].slice(0, 60);
        return `• ${date}: ${msg}`;
      })
      .join("\n");
  } catch (error) {
    return `Error fetching commits: ${error.message}`;
  }
}

async function getFileHistory(input) {
  try {
    const data = await githubAPI(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?sha=${GITHUB_BRANCH}&path=${input.path}&per_page=10`
    );

    return data
      .map((commit) => {
        const date = new Date(commit.commit.author.date).toLocaleDateString();
        const msg = commit.commit.message.split("\n")[0].slice(0, 50);
        return `• ${date}: ${msg}`;
      })
      .join("\n");
  } catch (error) {
    return `Error fetching history: ${error.message}`;
  }
}

async function createBranch(input) {
  try {
    // Get the SHA of the main branch
    const ref = await githubAPI(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/${GITHUB_BRANCH}`
    );

    // Create new branch
    await githubAPI(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs`, {
      method: "POST",
      body: JSON.stringify({
        ref: `refs/heads/${input.name}`,
        sha: ref.object.sha,
      }),
    });

    return `✅ Created branch: ${input.name}`;
  } catch (error) {
    return `Error creating branch: ${error.message}`;
  }
}

async function createPullRequest(input) {
  try {
    const data = await githubAPI(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`, {
      method: "POST",
      body: JSON.stringify({
        title: input.title,
        body: input.body || "",
        head: input.head,
        base: GITHUB_BRANCH,
      }),
    });

    return `✅ Created PR #${data.number}: ${data.html_url}`;
  } catch (error) {
    return `Error creating PR: ${error.message}`;
  }
}

async function triggerDeploy(input) {
  try {
    // Get current commit SHA
    const ref = await githubAPI(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/ref/heads/${GITHUB_BRANCH}`
    );

    // Get the current commit
    const commit = await githubAPI(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits/${ref.object.sha}`
    );

    // Create a new commit with the same tree (empty commit)
    const newCommit = await githubAPI(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/commits`,
      {
        method: "POST",
        body: JSON.stringify({
          message: input.message || "Trigger deploy",
          tree: commit.tree.sha,
          parents: [ref.object.sha],
        }),
      }
    );

    // Update the branch reference
    await githubAPI(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/refs/heads/${GITHUB_BRANCH}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          sha: newCommit.sha,
        }),
      }
    );

    return `✅ Deploy triggered. Vercel will pick up the change shortly.`;
  } catch (error) {
    return `Error triggering deploy: ${error.message}`;
  }
}

// Execute a tool
async function executeTool(name, input) {
  switch (name) {
    case "list_files":
      return await listFiles(input);
    case "read_file":
      return await readFile(input);
    case "write_file":
      return await writeFile(input);
    case "search_code":
      return await searchCode(input);
    case "get_recent_commits":
      return await getRecentCommits(input);
    case "get_file_history":
      return await getFileHistory(input);
    case "create_branch":
      return await createBranch(input);
    case "create_pull_request":
      return await createPullRequest(input);
    case "trigger_deploy":
      return await triggerDeploy(input);
    default:
      return `Unknown tool: ${name}`;
  }
}

export async function POST(request) {
  try {
    // Simple auth check
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.DEV_AUTH_TOKEN;

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check required env vars
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured. Add it to Vercel environment variables." },
        { status: 500 }
      );
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: "GITHUB_TOKEN not configured. Add it to Vercel environment variables." },
        { status: 500 }
      );
    }

    const { messages } = await request.json();

    // System prompt for the dev assistant
    const systemPrompt = `You are a development assistant for The AI Ethos, a solo AI product incubator. You have access to the GitHub repository and can help with:

- Reading and understanding code
- Making edits to files (creates commits directly)
- Searching for patterns across the codebase
- Viewing commit history
- Creating branches and pull requests

The repository (paulthebutcher/ethos) is an npm workspaces monorepo:

/                           # Repo root
├── apps/
│   ├── ethos/              # theaiethos.com - hub site
│   │   ├── app/            # Next.js App Router pages
│   │   ├── app/landing/    # Product landing pages
│   │   ├── app/projects/   # Project showcase
│   │   └── app/dev/        # This dev assistant
│   └── guildry/            # guildry.theaiethos.com
│       ├── app/
│       ├── components/
│       └── lib/
├── packages/
│   ├── auth/               # Clerk auth integration
│   ├── ui/                 # Shared React components
│   ├── database/           # Supabase utilities
│   ├── ai/                 # Claude AI utilities
│   └── config/             # Shared Tailwind/TS/ESLint
├── templates/              # App scaffolding templates
├── scripts/                # Utility scripts (new-app.sh)
└── docs/

IMPORTANT: Every write_file call creates a real commit to GitHub. Vercel auto-deploys on push.

When making changes:
1. Read the file first to understand current state
2. Make targeted, careful edits
3. Use clear commit messages
4. For multiple related changes, consider creating a branch and PR

Be concise. Show relevant code snippets, not entire files.`;

    // Call Claude with tools
    let response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      tools,
      messages,
    });

    // Collect all tool uses and results for the final response
    const allToolUses = [];

    // Handle tool use in a loop
    while (response.stop_reason === "tool_use") {
      const toolUseBlocks = response.content.filter(
        (block) => block.type === "tool_use"
      );

      // Track tool uses
      toolUseBlocks.forEach((t) => allToolUses.push(t.name));

      const toolResults = await Promise.all(
        toolUseBlocks.map(async (toolUse) => {
          const result = await executeTool(toolUse.name, toolUse.input);
          return {
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: result,
          };
        })
      );

      // Continue conversation with tool results
      response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        tools,
        messages: [
          ...messages,
          { role: "assistant", content: response.content },
          { role: "user", content: toolResults },
        ],
      });
    }

    // Extract text response
    const textContent = response.content.find((block) => block.type === "text");

    return NextResponse.json({
      response: textContent?.text || "No response",
      toolsUsed: allToolUses,
    });
  } catch (error) {
    console.error("Dev API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
