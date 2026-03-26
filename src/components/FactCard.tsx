import { Show, createMemo, createSignal, onCleanup, onMount, type JSX } from "solid-js";

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

const INITIAL_REVEAL_DELAY = 500;
const FADE_DURATION = 200;

function createInitialPlaylist(length: number): number[] {
  return Array.from({ length }, (_, index) => index);
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
  const [playlist, setPlaylist] = createSignal(createInitialPlaylist(props.facts.length));
  const [index, setIndex] = createSignal(0);
  const [fading, setFading] = createSignal(false);
  const [ready, setReady] = createSignal(false);

  let revealTimer: ReturnType<typeof setTimeout> | undefined;
  let fadeTimer: ReturnType<typeof setTimeout> | undefined;

  const hasFacts = createMemo(() => props.facts.length > 0);
  const fact = createMemo<ProcessedFact | null>(() => props.facts[playlist()[index()] ?? 0] ?? null);

  onMount(() => {
    if (!hasFacts()) {
      setReady(true);
      return;
    }

    revealTimer = setTimeout(() => {
      setFading(true);
      fadeTimer = setTimeout(() => {
        setPlaylist(createPlaylist(props.facts.length));
        setIndex(0);
        setReady(true);
        setFading(false);
      }, FADE_DURATION);
    }, INITIAL_REVEAL_DELAY);
  });

  onCleanup(() => {
    if (revealTimer) clearTimeout(revealTimer);
    if (fadeTimer) clearTimeout(fadeTimer);
  });

  function handleDice() {
    if (!ready() || !hasFacts()) return;

    setFading(true);
    fadeTimer = setTimeout(() => {
      setIndex(prev => {
        const nextIndex = prev + 1;

        if (nextIndex < playlist().length) return nextIndex;

        setPlaylist(createPlaylist(props.facts.length));
        return 0;
      });
      setFading(false);
    }, FADE_DURATION);
  }

  return (
    <div>
      <div class="flex items-center justify-between gap-2">
        <h2 class="text-xl font-bold">你不知道的 tcdw</h2>
        <button
          class="size-10 rounded-full transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-black/10 dark:enabled:hover:bg-white/10"
          aria-label="换一条"
          type="button"
          onClick={handleDice}
          disabled={!ready() || !hasFacts()}
        >
          {props.children}
        </button>
      </div>
      <div aria-busy={!ready()} class="transition-opacity duration-200" style={{ opacity: fading() ? "0" : "1" }}>
        <Show
          when={ready() && fact()}
          fallback={
            hasFacts() ? (
              <div class="mt-3 animate-pulse">
                <div class="aspect-3/2 w-full rounded-xl bg-black/8 dark:bg-white/10" />
                <div class="mt-3 space-y-2">
                  <div class="h-4 w-full rounded-full bg-black/8 dark:bg-white/10" />
                  <div class="h-4 w-10/12 rounded-full bg-black/8 dark:bg-white/10" />
                </div>
              </div>
            ) : (
              <div class="mt-3 text-sm leading-relaxed opacity-60">今天没有可以展示的 fact 呢</div>
            )
          }
        >
          {currentFact => (
            <>
              <div class="relative overflow-hidden rounded-xl bg-white dark:bg-black mt-3">
                <img
                  src={currentFact().src}
                  srcset={currentFact().srcSet}
                  width={currentFact().width}
                  height={currentFact().height}
                  alt={currentFact().alt}
                  class="aspect-3/2 object-cover filter grayscale opacity-70 w-full transition duration-300 hover:grayscale-0 hover:opacity-100"
                  loading="lazy"
                />
              </div>
              <div class="text-sm leading-relaxed opacity-60 mt-2">{currentFact().text}</div>
            </>
          )}
        </Show>
      </div>
    </div>
  );
}
