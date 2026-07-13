import {
  For,
  Show,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onMount,
  useContext,
  type JSX,
} from "solid-js";
import { addComment, getComments } from "./comment-api";
import {
  buildCommentTree,
  formatCommentDate,
  getAvatarSrcset,
  getAvatarUrl,
  getSavedCommentUser,
  saveCommentUser,
} from "./comment-helpers";
import type { AddCommentRequest, CommentMeta, CommentPost, CommentThread } from "./types";

interface CommentProps {
  slug: string;
  url: string;
  title?: string;
  apiBaseUrl?: string;
  gravatarBaseUrl?: string;
  jumpOffset?: number;
  disableInfoSave?: boolean;
  recaptchaSiteKey?: string;
}

interface CommentContextValue {
  slug: string;
  url: string;
  title: string;
  apiBaseUrl: string;
  gravatarBaseUrl: string;
  jumpOffset: number;
  disableInfoSave: boolean;
  recaptchaSiteKey?: string;
  recaptchaLoading: boolean;
  meta?: CommentMeta;
  refresh: () => Promise<void>;
}

const CommentContext = createContext<CommentContextValue>();

function useCommentContext(): CommentContextValue {
  const context = useContext(CommentContext);
  if (!context) throw new Error("Comment components must be rendered inside Comment");
  return context;
}

interface CommentFormData {
  name: string;
  email: string;
  website: string;
  content: string;
  receiveEmail: boolean;
}

function CommentInput(props: {
  id: string;
  value: string;
  onInput: (value: string) => void;
  type?: string;
  autocomplete?: string;
  required?: boolean;
}) {
  return (
    <input
      id={props.id}
      type={props.type ?? "text"}
      value={props.value}
      onInput={event => props.onInput(event.currentTarget.value)}
      autocomplete={props.autocomplete}
      required={props.required}
      class="block w-full rounded-md bg-white px-3.5 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:bg-gray-800 dark:text-gray-100 dark:outline-gray-600 dark:placeholder:text-gray-500 dark:focus:outline-primary-500"
    />
  );
}

function CommentFormItem(props: { label: string; for: string; required?: boolean; children: JSX.Element }) {
  return (
    <div>
      <label for={props.for} class="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
        {props.label}
        <Show when={props.required}>
          <span class="ms-0.5 text-red-500 dark:text-red-400">*</span>
        </Show>
      </label>
      {props.children}
    </div>
  );
}

function CommentForm(props: { targetId?: number; onSubmitted?: () => void }) {
  const context = useCommentContext();
  const [loading, setLoading] = createSignal(false);
  const [hasSavedUser, setHasSavedUser] = createSignal(false);
  const [error, setError] = createSignal("");
  const [formData, setFormData] = createSignal<CommentFormData>({
    name: "",
    email: "",
    website: "",
    content: "",
    receiveEmail: true,
  });
  const suffix = () => props.targetId ?? "root";

  onMount(() => {
    if (context.disableInfoSave) return;
    const user = getSavedCommentUser();
    if (!user) return;
    setHasSavedUser(true);
    setFormData(value => ({ ...value, ...user }));
  });

  const update = <K extends keyof CommentFormData>(key: K, value: CommentFormData[K]) => {
    setFormData(current => ({ ...current, [key]: value }));
  };

  const submit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async event => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = formData();
      let challengeResponse: string | undefined;
      if (context.recaptchaSiteKey) {
        if (!window.grecaptcha) throw new Error("人机验证尚未就绪，请稍后重试");
        challengeResponse = await window.grecaptcha.execute(context.recaptchaSiteKey, {
          action: "submit_comment",
        });
      }

      const request: AddCommentRequest = {
        slug: context.slug,
        url: context.url,
        title: context.title,
        name: data.name,
        email: data.email,
        website: data.website || undefined,
        content: data.content,
        receiveEmail: data.receiveEmail,
        parent: props.targetId,
        challengeResponse,
      };
      await addComment(context.apiBaseUrl, request);

      if (!context.disableInfoSave) {
        saveCommentUser({ name: data.name, email: data.email, website: data.website });
        setHasSavedUser(true);
      }
      setFormData(current => ({ ...current, content: "" }));
      await context.refresh();
      props.onSubmitted?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "评论发布失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form class="my-6 space-y-4" onSubmit={submit}>
      <Show
        when={hasSavedUser()}
        fallback={
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <CommentFormItem label="昵称" required for={`pomment-name__${suffix()}`}>
              <CommentInput
                id={`pomment-name__${suffix()}`}
                value={formData().name}
                onInput={value => update("name", value)}
                autocomplete="name"
                required
              />
            </CommentFormItem>
            <CommentFormItem label="邮箱" required for={`pomment-email__${suffix()}`}>
              <CommentInput
                id={`pomment-email__${suffix()}`}
                value={formData().email}
                onInput={value => update("email", value)}
                type="email"
                autocomplete="email"
                required
              />
            </CommentFormItem>
            <CommentFormItem label="网站" for={`pomment-website__${suffix()}`}>
              <CommentInput
                id={`pomment-website__${suffix()}`}
                value={formData().website}
                onInput={value => update("website", value)}
                type="url"
                autocomplete="url"
              />
            </CommentFormItem>
          </div>
        }
      >
        <div class="flex items-center justify-between rounded-md bg-gray-50 p-3 text-sm dark:bg-gray-800">
          <div>
            以 <strong>{formData().name}</strong> 的身份评论
          </div>
          <button
            type="button"
            class="text-primary-600 hover:underline dark:text-primary-400"
            onClick={() => setHasSavedUser(false)}
          >
            更改
          </button>
        </div>
      </Show>

      <CommentFormItem label="评论" required for={`pomment-comment__${suffix()}`}>
        <textarea
          id={`pomment-comment__${suffix()}`}
          value={formData().content}
          onInput={event => {
            update("content", event.currentTarget.value);
            event.currentTarget.style.height = "auto";
            event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
          }}
          required
          rows={3}
          class="block w-full resize-none rounded-md bg-white px-3.5 py-2 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 dark:bg-gray-800 dark:text-gray-100 dark:outline-gray-600 dark:placeholder:text-gray-500 dark:focus:outline-primary-500"
        />
      </CommentFormItem>

      <Show when={context.recaptchaSiteKey}>
        <div class="text-sm leading-normal opacity-60">
          This site is protected by reCAPTCHA and the Google&nbsp;
          <a class="underline" href="https://policies.google.com/privacy">
            Privacy Policy
          </a>{" "}
          and&nbsp;
          <a class="underline" href="https://policies.google.com/terms">
            Terms of Service
          </a>{" "}
          apply.
        </div>
      </Show>

      <Show when={error()}>
        <p role="alert" class="text-sm text-red-600 dark:text-red-400">
          {error()}
        </p>
      </Show>

      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        <button
          type="submit"
          class="block rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={loading() || context.recaptchaLoading}
        >
          {loading() ? "发布中……" : context.recaptchaLoading ? "正在初始化……" : "发布评论"}
        </button>
        <label class="flex items-center text-sm font-medium text-gray-900 dark:text-gray-300">
          <input
            checked={formData().receiveEmail}
            onChange={event => update("receiveEmail", event.currentTarget.checked)}
            type="checkbox"
            class="size-4"
          />
          <span class="ms-2">接收邮件通知</span>
        </label>
      </div>
    </form>
  );
}

function CommentDateTime(props: { datetime: number }) {
  return (
    <time class="ms-4 text-sm text-gray-400 dark:text-gray-500" dateTime={new Date(props.datetime).toISOString()}>
      {formatCommentDate(props.datetime)}
    </time>
  );
}

function CommentItem(props: { comment: CommentPost }) {
  const context = useCommentContext();
  const [replying, setReplying] = createSignal(false);
  const avatarSize = 64;
  const gravatar = (size: number) =>
    props.comment.avatar || getAvatarUrl(props.comment.emailHashed, size, context.gravatarBaseUrl);
  const srcset = (size: number) =>
    props.comment.avatar || getAvatarSrcset(props.comment.emailHashed, size, context.gravatarBaseUrl);
  const website = createMemo(() => {
    try {
      const url = new URL(props.comment.website);
      return url.protocol === "http:" || url.protocol === "https:" ? url.href : undefined;
    } catch {
      return undefined;
    }
  });

  const jumpToParent = () => {
    const parentId = props.comment.parentPost?.id;
    if (!parentId) return;
    const target = document.getElementById(`comment-${parentId}`);
    if (!target) return;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - context.jumpOffset - 15,
      behavior: "smooth",
    });
  };

  const toggleReply = () => {
    if (!replying() || window.confirm("确定要取消回复吗？已填写的内容将会丢失。")) {
      setReplying(value => !value);
    }
  };

  return (
    <div class="mb-6">
      <div id={`comment-${props.comment.id}`} class="flex">
        <div class="me-4 hidden shrink-0 sm:block">
          <img
            class="block rounded-lg bg-white shadow-xl transition-all dark:brightness-50 dark:hover:brightness-100"
            src={gravatar(avatarSize)}
            srcset={srcset(avatarSize)}
            alt={`${props.comment.name} 的头像`}
            width={avatarSize}
            height={avatarSize}
            loading="lazy"
          />
        </div>
        <div class="w-full min-w-0">
          <div class="mb-2 flex items-center">
            <img
              class="me-3 block rounded-lg bg-white shadow-xl transition-all dark:brightness-50 dark:hover:brightness-100 sm:hidden"
              src={gravatar(32)}
              srcset={srcset(32)}
              alt={`${props.comment.name} 的头像`}
              width={32}
              height={32}
              loading="lazy"
            />
            <Show when={website()} fallback={<span class="font-bold">{props.comment.name}</span>}>
              {href => (
                <a
                  href={href()}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-bold text-primary-600 hover:underline dark:text-primary-400"
                >
                  {props.comment.name}
                </a>
              )}
            </Show>
            <Show when={props.comment.byAdmin}>
              <span class="ms-2 rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-400">
                MOD
              </span>
            </Show>
            <CommentDateTime datetime={props.comment.createdAt} />
          </div>
          <div class="break-words whitespace-pre-wrap text-base leading-relaxed text-gray-800 dark:text-gray-200">
            <Show when={props.comment.parentPost}>
              <button
                class="me-1.5 cursor-pointer font-bold text-primary-600 hover:underline dark:text-primary-400"
                onClick={jumpToParent}
              >
                @{props.comment.parentPost?.name}
              </button>
            </Show>
            {props.comment.content}
          </div>
          <Show when={!context.meta?.locked}>
            <div class="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
              <button
                class="cursor-pointer text-sm text-primary-600 hover:underline dark:text-primary-400"
                onClick={toggleReply}
              >
                {replying() ? "取消回复" : "回复"}
              </button>
            </div>
          </Show>
        </div>
      </div>
      <Show when={replying()}>
        <CommentForm targetId={props.comment.id} onSubmitted={() => setReplying(false)} />
      </Show>
    </div>
  );
}

function CommentGroup(props: { posts: CommentThread[] }) {
  return (
    <div class="space-y-6">
      <For each={props.posts}>
        {thread => (
          <div class="mb-6">
            <CommentItem comment={thread.parentPost} />
            <For each={thread.childPost}>
              {comment => (
                <div class="ms-6 mt-4 sm:ms-8">
                  <CommentItem comment={comment} />
                </div>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
}

export function Comment(props: CommentProps) {
  const [posts, setPosts] = createSignal<CommentThread[]>([]);
  const [meta, setMeta] = createSignal<CommentMeta>();
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");
  const [recaptchaLoading, setRecaptchaLoading] = createSignal(Boolean(props.recaptchaSiteKey));

  const refresh = async () => {
    setError("");
    try {
      const result = await getComments(props.apiBaseUrl ?? "", props.slug);
      setMeta(result.meta);
      setPosts(buildCommentTree(result.post ?? []));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "评论系统初始化失败");
    } finally {
      setLoading(false);
    }
  };

  onMount(refresh);

  createEffect(() => {
    const siteKey = props.recaptchaSiteKey;
    if (!siteKey) return;
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => setRecaptchaLoading(false));
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[src*="recaptcha/api.js"]');
    const script = existing ?? document.createElement("script");
    script.addEventListener(
      "load",
      () => {
        window.grecaptcha?.ready(() => setRecaptchaLoading(false));
      },
      { once: true },
    );
    script.addEventListener("error", () => setRecaptchaLoading(false), { once: true });
    if (!existing) {
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  const context: CommentContextValue = {
    get slug() {
      return props.slug;
    },
    get url() {
      return props.url;
    },
    get title() {
      return props.title ?? document.title;
    },
    get apiBaseUrl() {
      return props.apiBaseUrl ?? "";
    },
    get gravatarBaseUrl() {
      return props.gravatarBaseUrl ?? "https://secure.gravatar.com/avatar/";
    },
    get jumpOffset() {
      return props.jumpOffset ?? 0;
    },
    get disableInfoSave() {
      return props.disableInfoSave ?? false;
    },
    get recaptchaSiteKey() {
      return props.recaptchaSiteKey;
    },
    get recaptchaLoading() {
      return recaptchaLoading();
    },
    get meta() {
      return meta();
    },
    refresh,
  };

  return (
    <CommentContext.Provider value={context}>
      <section class="mt-8 text-black dark:text-white" aria-label="评论">
        <Show when={!loading()} fallback={<div class="px-4 py-8 text-center">正在初始化评论系统……</div>}>
          <Show
            when={!error()}
            fallback={
              <div class="px-4 py-8 text-center">
                <p>{error()}</p>
                <button class="mt-2 cursor-pointer underline" onClick={refresh}>
                  重试？
                </button>
              </div>
            }
          >
            <Show when={!meta()?.locked}>
              <CommentForm />
            </Show>
            <Show when={posts().length > 0} fallback={<p class="py-6 text-center text-sm opacity-60">还没有评论</p>}>
              <CommentGroup posts={posts()} />
            </Show>
          </Show>
        </Show>
      </section>
    </CommentContext.Provider>
  );
}
