import { For, createSignal, onCleanup, onMount, type JSX } from "solid-js";

import { SITE_MENU } from "@/consts";

import styles from "./HeaderNav.module.css";

interface Props {
  avatar?: JSX.Element;
}

type MenuStep = 1 | 2 | 3;
type MenuMiddleStep = 1 | 2;

const navBarClassNameBase =
  "absolute -translate-x-2/4 left-2/4 h-[var(--navBar-height)] md:h-[inherit] backdrop-blur-2xl bg-white/80 dark:bg-primary-950 dark:bg-primary-950/80 shadow-2xl [transition:top_150ms,height_400ms_cubic-bezier(.47,1.64,.41,.8)] overflow-clip";
const navBarClassNameTop = "rounded-[2.25rem] top-4 w-[calc(100dvw-2rem)] md:w-max";
const navBarClassNameNormal = "w-full top-0 shadow-[rgba(0,0,0,0.15)]";

// 移动端菜单 a11y ID
const mobileMenuId = "koi-mobile-menu-list";

// 高度基准数值 (rem)
const mobileNavBaseHeight = 4.5;
const mobileMenuBaseHeight = 1.5;
const mobileMenuItemHeight = 3.5;

function getBar1Class(step: MenuStep) {
  switch (step) {
    case 1:
      return styles.bar1Step1;
    case 2:
      return styles.bar1Step2;
    case 3:
      return styles.bar1Step3;
  }
}

function getBar2Class(step: MenuMiddleStep) {
  switch (step) {
    case 1:
      return styles.bar2Step1;
    case 2:
      return styles.bar2Step2;
  }
}

function getBar3Class(step: MenuStep) {
  switch (step) {
    case 1:
      return styles.bar3Step1;
    case 2:
      return styles.bar3Step2;
    case 3:
      return styles.bar3Step3;
  }
}

export default function HeaderNav(props: Props) {
  let navBackground: HTMLElement | null = null;
  let navScrollNotice: HTMLElement | null = null;
  let menuTimer: ReturnType<typeof setTimeout> | undefined;
  let menuItemTimer: ReturnType<typeof setTimeout> | undefined;

  const [navBarClassName, setNavBarClassName] = createSignal(navBarClassNameTop);
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);
  const [menuStep, setMenuStep] = createSignal<MenuStep>(1);
  const [menuStepMiddle, setMenuStepMiddle] = createSignal<MenuMiddleStep>(1);
  const [menuItemHidden, setMenuItemHidden] = createSignal(true);

  const mobileNavHeight = () =>
    mobileMenuOpen()
      ? mobileNavBaseHeight + mobileMenuBaseHeight + mobileMenuItemHeight * SITE_MENU.length
      : mobileNavBaseHeight;

  function clearMenuTimers() {
    if (menuTimer) {
      clearTimeout(menuTimer);
      menuTimer = undefined;
    }

    if (menuItemTimer) {
      clearTimeout(menuItemTimer);
      menuItemTimer = undefined;
    }
  }

  function handleScroll() {
    if (navBackground && window.scrollY > navBackground.getBoundingClientRect().height * (1 / 1.618)) {
      setNavBarClassName(navBarClassNameNormal);
    } else {
      setNavBarClassName(navBarClassNameTop);
    }

    if (!navScrollNotice) {
      return;
    }

    if (window.scrollY > 64) {
      navScrollNotice.classList.add("opacity-0");
      return;
    }

    navScrollNotice.classList.remove("opacity-0");
  }

  function handleMobileMenuToggle(nextOpen = !mobileMenuOpen()) {
    setMobileMenuOpen(nextOpen);
    clearMenuTimers();
    setMenuStep(2);

    if (nextOpen) {
      setMenuStepMiddle(1);
      menuTimer = setTimeout(() => {
        setMenuStep(3);
        setMenuStepMiddle(2);
      }, 200);
      setMenuItemHidden(false);
      return;
    }

    setMenuStepMiddle(2);
    menuTimer = setTimeout(() => {
      setMenuStep(1);
      setMenuStepMiddle(1);
    }, 200);
    menuItemTimer = setTimeout(() => {
      setMenuItemHidden(true);
    }, 400);
  }

  onMount(() => {
    navBackground = document.getElementById("navBackground");
    navScrollNotice = document.getElementById("navScrollNotice");
    globalThis.addEventListener?.("scroll", handleScroll);
    handleScroll();
  });

  onCleanup(() => {
    clearMenuTimers();
    globalThis.removeEventListener?.("scroll", handleScroll);
  });

  return (
    <nav class="fixed top-0 z-40 w-full">
      <div
        id="navBar"
        class={`${navBarClassNameBase} ${navBarClassName()}`}
        style={{ "--navBar-height": `${mobileNavHeight()}rem` } as JSX.CSSProperties}
      >
        <div class="flex items-center justify-between gap-8 ps-3 pe-3 py-3 md:justify-center">
          <a href="./" class="block flex-none" title="首页">
            {props.avatar}
          </a>
          <ul class="hidden md:contents">
            <For each={SITE_MENU}>
              {entry => (
                <li class="contents">
                  <a
                    class="text-base leading-6 h-6 block text-black dark:text-white hover:text-accent-600 dark:hover:text-accent-500 transition-colors duration-200 flex-none"
                    href={entry.href}
                    target={entry.target}
                  >
                    {entry.title}
                  </a>
                </li>
              )}
            </For>
          </ul>
          <div class="flex flex-none">
            <a
              aria-label="订阅本站"
              class="w-12 h-12 flex items-center justify-center rounded-full -ms-3 text-black dark:text-white transition-colors bg-white/0 active:bg-white/10"
              href="./atom.xml"
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1408"
                height="1408"
                viewBox="0 0 1408 1408"
                class="h-[1.25rem] w-[1.25rem]"
              >
                <path
                  fill="currentColor"
                  d="M384 1216q0 80-56 136t-136 56t-136-56t-56-136t56-136t136-56t136 56t56 136m512 123q2 28-17 48q-18 21-47 21H697q-25 0-43-16.5t-20-41.5q-22-229-184.5-391.5T58 774q-25-2-41.5-20T0 711V576q0-29 21-47q17-17 43-17h5q160 13 306 80.5T634 774q114 113 181.5 259t80.5 306m512 2q2 27-18 47q-18 20-46 20h-143q-26 0-44.5-17.5T1137 1348q-12-215-101-408.5t-231.5-336t-336-231.5T60 270q-25-1-42.5-19.5T0 207V64q0-28 20-46Q38 0 64 0h3q262 13 501.5 120T994 414q187 186 294 425.5t120 501.5"
                />
              </svg>
            </a>
            <button
              onClick={() => handleMobileMenuToggle()}
              aria-label="打开菜单"
              aria-controls={mobileMenuId}
              aria-expanded={mobileMenuOpen()}
              class="flex h-12 w-12 items-center justify-center rounded-full bg-white/0 transition-colors active:bg-white/10 md:hidden md:-ms-3"
            >
              <span class="relative block h-5 w-5" aria-hidden="true">
                <span
                  class={`duration-200 block absolute left-1/2 w-5 h-[0.225rem] rounded-full bg-black dark:bg-white ${getBar1Class(menuStep())}`}
                />
                <span
                  class={`duration-200 block absolute left-1/2 top-1/2 w-5 h-[0.225rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black dark:bg-white ${getBar2Class(menuStepMiddle())}`}
                />
                <span
                  class={`duration-200 block absolute left-1/2 w-5 h-[0.225rem] rounded-full bg-black dark:bg-white ${getBar3Class(menuStep())}`}
                />
              </span>
            </button>
          </div>
        </div>
        <div class={`flex flex-col items-center md:hidden ${menuItemHidden() ? "hidden" : ""}`} id={mobileMenuId}>
          <hr
            class={`w-[calc(100%-1.5rem)] transition-colors duration-400 ${mobileMenuOpen() ? "border-black/10 dark:border-white/10" : "border-transparent"}`}
          />
          <ul class="w-full p-3">
            <For each={SITE_MENU}>
              {entry => (
                <li class="contents">
                  <a
                    onClick={() => handleMobileMenuToggle(false)}
                    class="text-xl leading-6 h-14 flex items-center justify-center text-black dark:text-white hover:text-accent-600 dark:hover:text-accent-500 transition-colors duration-200 flex-none"
                    href={entry.href}
                    target={entry.target}
                  >
                    {entry.title}
                  </a>
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
    </nav>
  );
}
