import { createSignal, createMemo, type JSX } from "solid-js";

export interface ProcessedFact {
  src: string;
  width: number;
  height: number;
  alt: string;
  text: string;
  srcSet?: string;
}

interface Props {
  facts: ProcessedFact[];
  children?: JSX.Element;
}

function getRandomIndex(length: number, exclude?: number): number {
  if (length <= 1) return 0;
  let next: number;
  do {
    next = Math.floor(Math.random() * length);
  } while (next === exclude);
  return next;
}

export default function FactCard(props: Props) {
  const [index, setIndex] = createSignal(getRandomIndex(props.facts.length));
  const [fading, setFading] = createSignal(false);

  const fact = createMemo(() => props.facts[index()]);

  function handleDice() {
    setFading(true);
    setTimeout(() => {
      setIndex((prev) => getRandomIndex(props.facts.length, prev));
      setFading(false);
    }, 200);
  }

  return (
    <div>
      <div class="flex items-center justify-between gap-2">
        <h2 class="text-xl font-bold">你不知道的 tcdw</h2>
        <button
          class="size-10 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
          aria-label="换一条"
          type="button"
          onClick={handleDice}
        >
          {props.children}
        </button>
      </div>
      <div
        class="transition-opacity duration-200"
        style={{ opacity: fading() ? "0" : "1" }}
      >
        <div class="relative overflow-hidden rounded-xl bg-white dark:bg-black mt-3">
          <img
            src={fact().src}
            srcset={fact().srcSet}
            width={fact().width}
            height={fact().height}
            alt={fact().alt}
            class="aspect-3/2 object-cover filter grayscale opacity-80 w-full"
            loading="lazy"
          />
        </div>
        <div class="text-sm leading-relaxed opacity-60 mt-2">{fact().text}</div>
      </div>
    </div>
  );
}
