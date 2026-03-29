/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_AUTHOR_NAME, SITE_TITLE } from "@/consts";
import sharp from "sharp";
import satori, { type SatoriOptions } from "satori";
import { normalizeOgDescription, trimOgText } from "@/utils/og";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const FONT_NAME = "ChillRoundF";
const CARD_X = 40;
const CARD_Y = 40;
const CARD_WIDTH = 1120;
const CARD_HEIGHT = 550;
const CARD_PADDING = 50;
const AUTHOR_SECTION_HEIGHT = 70;
const AUTHOR_SECTION_GAP = 40;
const TEXT_X = CARD_X + CARD_PADDING;
const TEXT_Y = CARD_Y + CARD_PADDING + AUTHOR_SECTION_HEIGHT + AUTHOR_SECTION_GAP;
const TEXT_WIDTH = CARD_WIDTH - CARD_PADDING * 2;
const TEXT_HEIGHT = CARD_HEIGHT - CARD_PADDING * 2 - AUTHOR_SECTION_HEIGHT - AUTHOR_SECTION_GAP;
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
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: [
      {
        name: FONT_NAME,
        data: fontRegular,
        weight: 400,
        style: "normal" as const,
      },
      {
        name: FONT_NAME,
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
        fontFamily: FONT_NAME,
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
        fontFamily: FONT_NAME,
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: `${TEXT_Y}px`,
          left: `${TEXT_X}px`,
          width: `${TEXT_WIDTH}px`,
          height: `${TEXT_HEIGHT}px`,
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
