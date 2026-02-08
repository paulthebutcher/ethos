import { ImageResponse } from "@vercel/og";

/**
 * OG Image generator component
 * Use with @vercel/og in an API route
 *
 * @example
 * // app/api/og/route.js
 * import { generateOGImage, OGImageTemplate } from "@ethos/meta/og";
 * export const GET = generateOGImage;
 */

/**
 * Default OG Image template
 */
export function OGImageTemplate({
  title = "AI Ethos",
  description = "",
  icon = "🚀",
  color = "#0ea5e9",
  appName = "",
}) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        padding: "60px",
      }}
    >
      {/* Top bar with brand color */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "8px",
          backgroundColor: color,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {/* Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <span style={{ fontSize: "64px" }}>{icon}</span>
          {appName && (
            <span
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#64748b",
              }}
            >
              {appName}
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#0f172a",
            lineHeight: 1.2,
            margin: 0,
            marginBottom: "16px",
          }}
        >
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p
            style={{
              fontSize: "28px",
              color: "#64748b",
              lineHeight: 1.4,
              margin: 0,
              maxWidth: "80%",
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #e2e8f0",
          paddingTop: "24px",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            color: "#94a3b8",
          }}
        >
          theaiethos.com
        </span>
        <span
          style={{
            fontSize: "16px",
            color: "#cbd5e1",
          }}
        >
          AI-Powered Tools
        </span>
      </div>
    </div>
  );
}

/**
 * Generate OG Image API handler
 * Use this as your GET handler in /api/og/route.js
 */
export async function generateOGImage(request) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") || "AI Ethos";
  const description = searchParams.get("desc") || "";
  const icon = searchParams.get("icon") || "🚀";
  const color = searchParams.get("color")
    ? `#${searchParams.get("color")}`
    : "#0ea5e9";
  const appName = searchParams.get("app") || "";

  return new ImageResponse(
    <OGImageTemplate
      title={title}
      description={description}
      icon={icon}
      color={color}
      appName={appName}
    />,
    {
      width: 1200,
      height: 630,
    }
  );
}

export default generateOGImage;
