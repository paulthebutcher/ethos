import { NextResponse } from "next/server";

// GitHub config
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || "paulthebutcher";
const GITHUB_REPO = process.env.GITHUB_REPO || "ethos";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

export async function POST(request) {
  try {
    // Simple auth check
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.DEV_AUTH_TOKEN;

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: "GITHUB_TOKEN not configured" },
        { status: 500 }
      );
    }

    const { path = "" } = await request.json();

    // Fetch directory contents from GitHub
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { error: `GitHub API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // If it's a single file, return empty (we only list directories)
    if (!Array.isArray(data)) {
      return NextResponse.json({ files: [] });
    }

    // Format for the file tree component
    const files = data
      .map((item) => ({
        name: item.name,
        type: item.type === "dir" ? "dir" : "file",
        path: item.path,
      }))
      .sort((a, b) => {
        // Directories first, then alphabetical
        if (a.type === "dir" && b.type !== "dir") return -1;
        if (a.type !== "dir" && b.type === "dir") return 1;
        return a.name.localeCompare(b.name);
      });

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Files API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
