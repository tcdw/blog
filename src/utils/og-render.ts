import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_AUTHOR_NAME, SITE_TITLE } from "@/consts";
import sharp from "sharp";
import satori from "satori";
import { normalizeOgDescription, trimOgText } from "@/utils/og";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const FONT_NAME = "ChillRoundF";
const FONT_WEIGHT = 400;
const FONT_FILE = join(process.cwd(), "src/assets/fonts/og/ChillRoundF-Regular.otf");
const fontDataPromise = readFile(FONT_FILE);

type SatoriChild = SatoriElement | string | number | null | undefined | false;

type SatoriElement = {
  type: string;
  props: Record<string, unknown> & {
    children?: SatoriChild | SatoriChild[];
  };
};

export interface OgCardPayload {
  title: string;
  description?: string;
  eyebrow: string;
  pathLabel: string;
  meta?: string;
}

function h(type: string, props: Record<string, unknown> | null = null, ...children: SatoriChild[]): SatoriElement {
  const normalizedProps = {
    ...(props ?? {}),
  };

  if (type === "div") {
    const style = ((normalizedProps.style as Record<string, unknown> | undefined) ?? {});
    normalizedProps.style = {
      display: "flex",
      ...style,
    };
  }

  return {
    type,
    props: {
      ...normalizedProps,
      children: children.flat().filter(Boolean),
    },
  };
}

function getTitleFontSize(title: string) {
  if (title.length > 44) {
    return 52;
  }

  if (title.length > 26) {
    return 60;
  }

  return 68;
}

export async function renderOgImage(payload: OgCardPayload) {
  const description = trimOgText(normalizeOgDescription(payload.description), 120);
  const title = trimOgText(payload.title.trim(), 64);
  const titleFontSize = getTitleFontSize(title);
  const fontData = await fontDataPromise;

  const svg = await satori(
    h(
      "div",
      {
        lang: "zh-CN",
        style: {
          display: "flex",
          width: `${OG_WIDTH}px`,
          height: `${OG_HEIGHT}px`,
          position: "relative",
          overflow: "hidden",
          background: "#eff6ff",
          color: "#0f172a",
          fontFamily: FONT_NAME,
        },
      },
      h("div", {
        style: {
          display: "flex",
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage: "linear-gradient(135deg, #f8fbff 0%, #dbeafe 58%, #fff7ed 100%)",
        },
      }),
      h("div", {
        style: {
          display: "flex",
          position: "absolute",
          top: "-96px",
          right: "-72px",
          width: "360px",
          height: "360px",
          borderRadius: "999px",
          background: "rgba(14, 165, 233, 0.16)",
        },
      }),
      h("div", {
        style: {
          display: "flex",
          position: "absolute",
          bottom: "-120px",
          left: "-60px",
          width: "340px",
          height: "340px",
          borderRadius: "999px",
          background: "rgba(251, 191, 36, 0.14)",
        },
      }),
      h(
        "div",
        {
          style: {
            display: "flex",
            position: "relative",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            margin: "32px",
            padding: "42px 46px",
            borderRadius: "34px",
            background: "rgba(255, 255, 255, 0.82)",
            border: "1px solid rgba(255, 255, 255, 0.9)",
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.14)",
          },
        },
        h(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            },
          },
          h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "12px",
              },
            },
            h("div", {
              style: {
                width: "14px",
                height: "14px",
                borderRadius: "999px",
                background: "#0284c7",
              },
            }),
            h(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  background: "rgba(2, 132, 199, 0.1)",
                  color: "#0369a1",
                  fontSize: "22px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                },
              },
              payload.eyebrow,
            ),
          ),
          h(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                color: "#475569",
              },
            },
            h(
              "div",
              {
                style: {
                  display: "flex",
                  fontSize: "26px",
                },
              },
              SITE_TITLE,
            ),
            h(
              "div",
              {
                style: {
                  display: "flex",
                  fontSize: "18px",
                  opacity: 0.75,
                },
              },
              `by ${SITE_AUTHOR_NAME}`,
            ),
          ),
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              marginTop: "22px",
            },
          },
          h(
            "div",
            {
              style: {
                display: "flex",
                fontSize: `${titleFontSize}px`,
                lineHeight: 1.18,
                fontWeight: FONT_WEIGHT,
                color: "#0f172a",
                maxWidth: "980px",
              },
            },
            title,
          ),
          h(
            "div",
            {
              style: {
                display: "flex",
                fontSize: "29px",
                lineHeight: 1.55,
                color: "#334155",
                maxWidth: "980px",
              },
            },
            description,
          ),
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "24px",
            },
          },
          h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "16px",
                color: "#0f172a",
              },
            },
            h("div", {
              style: {
                width: "18px",
                height: "18px",
                borderRadius: "999px",
                background: "#f59e0b",
              },
            }),
            h(
              "div",
              {
                style: {
                  display: "flex",
                  fontSize: "26px",
                },
              },
              payload.pathLabel,
            ),
          ),
          payload.meta
            ? h(
                "div",
                {
                  style: {
                    display: "flex",
                    fontSize: "22px",
                    color: "#64748b",
                  },
                },
                payload.meta,
              )
            : null,
        ),
      ),
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        {
          name: FONT_NAME,
          data: fontData,
          weight: FONT_WEIGHT,
          style: "normal",
        },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
