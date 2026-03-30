import { Show, createEffect, createMemo, createSignal, on, onCleanup, onMount, type JSX } from "solid-js";
import { createInitialPlaylist, createPlaylist } from "./fact-card-helpers";
import { fadeDuration, initialRevealDelay } from "./fact-card.const";
import type { ProcessedFact } from "./types";

interface Props {
  facts: ProcessedFact[];
  children?: JSX.Element;
}

export function FactCard(props: Props) {
  const [playlist, setPlaylist] = createSignal(createInitialPlaylist(props.facts.length));
  const [index, setIndex] = createSignal(0);
  const [fading, setFading] = createSignal(false);
  const [ready, setReady] = createSignal(false);
  const [imageLoaded, setImageLoaded] = createSignal(false);

  let revealTimer: ReturnType<typeof setTimeout> | undefined;
  let fadeTimer: ReturnType<typeof setTimeout> | undefined;

  const fact = createMemo<ProcessedFact | null>(() => props.facts[playlist()[index()] ?? 0] ?? null);
  const busy = createMemo(() => !ready() || !imageLoaded());

  createEffect(
    on(
      () => fact()?.src,
      source => {
        if (!source) return;
        setImageLoaded(false);
      },
    ),
  );

  onMount(() => {
    revealTimer = setTimeout(() => {
      setFading(true);
      fadeTimer = setTimeout(() => {
        setPlaylist(createPlaylist(props.facts.length));
        setIndex(0);
        setReady(true);
        setFading(false);
      }, fadeDuration);
    }, initialRevealDelay);
  });

  onCleanup(() => {
    if (revealTimer) clearTimeout(revealTimer);
    if (fadeTimer) clearTimeout(fadeTimer);
  });

  function handleDice() {
    if (!ready()) return;

    setFading(true);
    fadeTimer = setTimeout(() => {
      setIndex(prev => {
        const nextIndex = prev + 1;

        if (nextIndex < playlist().length) return nextIndex;

        setPlaylist(createPlaylist(props.facts.length));
        return 0;
      });
      setFading(false);
    }, fadeDuration);
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
          disabled={!ready() || fading() || !imageLoaded()}
        >
          {props.children}
        </button>
      </div>
      <div aria-busy={busy()} class="transition-opacity duration-200" style={{ opacity: fading() ? "0" : "1" }}>
        <Show
          when={ready() && fact()}
          keyed
          fallback={
            <div class="mt-3 animate-pulse">
              <div class="aspect-3/2 w-full rounded-xl bg-black/8 dark:bg-white/10" />
              <div class="mt-3 space-y-2">
                <div class="h-4 w-full rounded-full bg-black/8 dark:bg-white/10" />
                <div class="h-4 w-10/12 rounded-full bg-black/8 dark:bg-white/10" />
              </div>
            </div>
          }
        >
          {currentFact => (
            <>
              <div class="relative overflow-hidden rounded-xl bg-white dark:bg-black mt-3">
                <Show when={!imageLoaded()}>
                  <div class="absolute inset-0 animate-pulse bg-black/8 dark:bg-white/10" />
                </Show>
                <img
                  src={currentFact.src}
                  srcset={currentFact.srcSet}
                  width={currentFact.width}
                  height={currentFact.height}
                  alt={currentFact.alt}
                  class="aspect-3/2 object-cover filter w-full transition duration-300 hover:grayscale-0 hover:opacity-100"
                  classList={{
                    "grayscale opacity-70": imageLoaded(),
                    "opacity-0": !imageLoaded(),
                  }}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />
              </div>
              <div class="text-sm leading-relaxed opacity-60 mt-2">{currentFact.text}</div>
            </>
          )}
        </Show>
      </div>
    </div>
  );
}
