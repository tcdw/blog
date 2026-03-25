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

function createPlaylist(length: number): number[] {
  const playlist = Array.from({ length }, (_, index) => index);

  for (let index = playlist.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [playlist[index], playlist[swapIndex]] = [playlist[swapIndex], playlist[index]];
  }

  return playlist;
}

export default function FactCard(props: Props) {
  const [playlist, setPlaylist] = createSignal(createPlaylist(props.facts.length));
  const [index, setIndex] = createSignal(0);
  const [fading, setFading] = createSignal(false);

  const fact = createMemo(() => props.facts[playlist()[index()] ?? 0]);

  function handleDice() {
    setFading(true);
    setTimeout(() => {
      setIndex(prev => {
        const nextIndex = prev + 1;

        if (nextIndex < playlist().length) return nextIndex;

        setPlaylist(createPlaylist(props.facts.length));
        return 0;
      });
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
      <div class="transition-opacity duration-200" style={{ opacity: fading() ? "0" : "1" }}>
        <div class="relative overflow-hidden rounded-xl bg-white dark:bg-black mt-3">
          <img
            src={fact().src}
            srcset={fact().srcSet}
            width={fact().width}
            height={fact().height}
            alt={fact().alt}
            class="aspect-3/2 object-cover filter grayscale opacity-70 w-full transition duration-300 hover:grayscale-0 hover:opacity-100"
            loading="lazy"
          />
        </div>
        <div class="text-sm leading-relaxed opacity-60 mt-2">{fact().text}</div>
      </div>
    </div>
  );
}
