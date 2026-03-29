/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_AUTHOR_NAME, SITE_TITLE } from "@/consts";
import sharp from "sharp";
import satori from "satori";
import { normalizeOgDescription, trimOgText } from "@/utils/og";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const FONT_NAME = "ChillRoundF";
const FONT_REGULAR_FILE = join(process.cwd(), "src/assets/fonts/og/ChillRoundFRegular.otf");
const FONT_BOLD_FILE = join(process.cwd(), "src/assets/fonts/og/ChillRoundFBold.otf");
const AVATAR_FILE = join(process.cwd(), "src/assets/avatar.png");
const CORNER_MASK_FILE = join(process.cwd(), "src/assets/corner_mask.png");
const CORNER_FILE = join(process.cwd(), "src/assets/corner.png");
const fontRegularPromise = readFile(FONT_REGULAR_FILE);
const fontBoldPromise = readFile(FONT_BOLD_FILE);
const avatarDataUriPromise = readFile(AVATAR_FILE).then(buf => `data:image/png;base64,${buf.toString("base64")}`);
const cornerMaskDataUriPromise = readFile(CORNER_MASK_FILE).then(
  buf => `data:image/png;base64,${buf.toString("base64")}`,
);
const cornerDataUriPromise = readFile(CORNER_FILE).then(buf => `data:image/png;base64,${buf.toString("base64")}`);

export interface OgCardPayload {
  title: string;
  description?: string;
  eyebrow: string;
  pathLabel: string;
  meta?: string;
}

export async function renderOgImage(payload: OgCardPayload) {
  const description = trimOgText(normalizeOgDescription(payload.description), 100);
  const title = trimOgText(payload.title.trim(), 64);
  const [fontRegular, fontBold, avatarDataUri, cornerMaskDataUri, cornerDataUri] = await Promise.all([
    fontRegularPromise,
    fontBoldPromise,
    avatarDataUriPromise,
    cornerMaskDataUriPromise,
    cornerDataUriPromise,
  ]);

  const svg = await satori(
    <div
      lang="zh-CN"
      style={{
        display: "flex",
        width: "1200px",
        height: "630px",
        position: "relative",
        background: "#f0f9ff", // 稍微明亮一点的蓝
        color: "#0f172a",
        fontFamily: FONT_NAME,
      }}
    >
      {/* 背景装饰：增强对比度 */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: "-100px",
          right: "-50px",
          width: "500px",
          height: "500px",
          borderRadius: "999px",
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(14, 165, 233, 0) 70%)",
        }}
      />

      <div
        style={{
          display: "flex",
          position: "relative",
          flexDirection: "column",
          width: "1120px",
          height: "550px",
          margin: "40px",
          padding: "50px",
          borderRadius: "40px",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)", // Satori 不支持这个，但如果转 SVG 后续处理可以考虑
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.1)",
        }}
      >
        <img
          src={cornerMaskDataUri}
          width={721}
          height={749}
          style={{
            position: "absolute",
            right: 60,
            bottom: -19,
            width: 500,
            height: 519,
          }}
        />

        <img
          src={cornerDataUri}
          width={721}
          height={749}
          style={{
            position: "absolute",
            right: 60,
            bottom: -19,
            width: 500,
            height: 519,
            opacity: 0.07,
          }}
        />

        {/* 作者信息 */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
          <img
            src={avatarDataUri}
            width={70}
            height={70}
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "70px",
              marginRight: "20px",
              border: "2px solid #e2e8f0",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "30px",
                fontWeight: 800,
                color: "#1e293b",
                letterSpacing: "-0.5px",
              }}
            >
              {SITE_TITLE}
            </div>
            <div style={{ fontSize: "20px", color: "#64748b", marginTop: "10px" }}>{`by ${SITE_AUTHOR_NAME}`}</div>
          </div>
        </div>

        {/* 主体内容 */}
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <div
            style={{
              display: "flex",
              fontSize: "60px",
              lineHeight: 1.375,
              fontWeight: 900,
              color: "#0f172a",
              marginBottom: "24px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "30px",
              lineHeight: 1.625,
              color: "#475569",
              opacity: 0.9,
            }}
          >
            {description}
          </div>
        </div>
      </div>
    </div>,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        {
          name: FONT_NAME,
          data: fontRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: FONT_NAME,
          data: fontBold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      // "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
