/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_AUTHOR_NAME, SITE_TITLE } from "@/consts";
import sharp from "sharp";
import satori, { type SatoriOptions } from "satori";
import { normalizeOgDescription, trimOgText } from "@/utils/og";

const ogWidth = 1200;
const ogHeight = 630;
const fontName = "ChillRoundF";
const cardX = 40;
const cardY = 40;
const cardWidth = 1120;
const cardHeight = 550;
const cardPadding = 50;
const authorSectionHeight = 70;
const authorSectionGap = 40;
const textX = cardX + cardPadding;
const textY = cardY + cardPadding + authorSectionHeight + authorSectionGap;
const textWidth = cardWidth - cardPadding * 2;
const textHeight = cardHeight - cardPadding * 2 - authorSectionHeight - authorSectionGap;
const fontRegularFile = join(process.cwd(), "src/assets/fonts/og/ChillRoundFRegular.otf");
const fontBoldFile = join(process.cwd(), "src/assets/fonts/og/ChillRoundFBold.otf");
const avatarFile = join(process.cwd(), "src/assets/avatar.png");
const cornerMaskFile = join(process.cwd(), "src/assets/corner_mask.png");
const cornerFile = join(process.cwd(), "src/assets/corner.png");
const fontRegularPromise = readFile(fontRegularFile);
const fontBoldPromise = readFile(fontBoldFile);
const avatarDataUriPromise = readFile(avatarFile).then(buf => `data:image/png;base64,${buf.toString("base64")}`);
const cornerMaskDataUriPromise = readFile(cornerMaskFile).then(
  buf => `data:image/png;base64,${buf.toString("base64")}`,
);
const cornerDataUriPromise = readFile(cornerFile).then(buf => `data:image/png;base64,${buf.toString("base64")}`);
const fontDataPromise = Promise.all([fontRegularPromise, fontBoldPromise]).then(([fontRegular, fontBold]) => ({
  fontRegular,
  fontBold,
}));
const staticAssetsPromise = Promise.all([avatarDataUriPromise, cornerMaskDataUriPromise, cornerDataUriPromise]).then(
  ([avatarDataUri, cornerMaskDataUri, cornerDataUri]) => ({
    avatarDataUri,
    cornerMaskDataUri,
    cornerDataUri,
  }),
);

let backgroundPngPromise: Promise<Buffer> | undefined;

export interface OgCardPayload {
  title: string;
  description?: string;
  eyebrow: string;
  pathLabel: string;
  meta?: string;
}

function getSatoriOptions(fontRegular: Buffer, fontBold: Buffer): SatoriOptions {
  return {
    width: ogWidth,
    height: ogHeight,
    fonts: [
      {
        name: fontName,
        data: fontRegular,
        weight: 400,
        style: "normal" as const,
      },
      {
        name: fontName,
        data: fontBold,
        weight: 700,
        style: "normal" as const,
      },
    ],
  };
}

async function renderBackgroundPng() {
  const [{ fontRegular, fontBold }, { avatarDataUri, cornerMaskDataUri, cornerDataUri }] = await Promise.all([
    fontDataPromise,
    staticAssetsPromise,
  ]);

  const svg = await satori(
    <div
      lang="zh-CN"
      style={{
        display: "flex",
        width: "1200px",
        height: "630px",
        position: "relative",
        background: "#f0f9ff",
        color: "#0f172a",
        fontFamily: fontName,
      }}
    >
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
          backdropFilter: "blur(10px)",
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

        <div style={{ display: "flex", alignItems: "center" }}>
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
      </div>
    </div>,
    getSatoriOptions(fontRegular, fontBold),
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}

function getBackgroundPng() {
  // Cache the static layer once per process so repeated OG renders only lay out text.
  backgroundPngPromise ??= renderBackgroundPng();
  return backgroundPngPromise;
}

async function renderTextOverlaySvg(title: string, description: string) {
  const { fontRegular, fontBold } = await fontDataPromise;

  return satori(
    <div
      lang="zh-CN"
      style={{
        display: "flex",
        width: "1200px",
        height: "630px",
        position: "relative",
        background: "transparent",
        color: "#0f172a",
        fontFamily: fontName,
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: `${textY}px`,
          left: `${textX}px`,
          width: `${textWidth}px`,
          height: `${textHeight}px`,
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "60px",
            lineHeight: 1.375,
            fontWeight: 900,
            color: "#0f172a",
            marginBottom: description ? "24px" : "0",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
        {description ? (
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
        ) : null}
      </div>
    </div>,
    getSatoriOptions(fontRegular, fontBold),
  );
}

export async function renderOgImage(payload: OgCardPayload) {
  const description = trimOgText(normalizeOgDescription(payload.description), 100);
  const title = trimOgText(payload.title.trim(), 64);
  const [backgroundPng, textOverlaySvg] = await Promise.all([
    getBackgroundPng(),
    renderTextOverlaySvg(title, description),
  ]);
  const png = await sharp(backgroundPng)
    .composite([
      {
        input: Buffer.from(textOverlaySvg),
      },
    ])
    .png()
    .toBuffer();
  const responseBody = new Blob([new Uint8Array(png)], { type: "image/png" });

  return new Response(responseBody, {
    headers: {
      "Content-Type": "image/png",
      // "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
