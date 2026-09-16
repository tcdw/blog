# AGENTS.md

## 项目目标

- 维护 tcdw 的个人主页（博客和名牌二合一）。

## 技术栈

- Astro 7（静态站点）
- SolidJS（Astro Islands）
- Tailwind CSS v4
- TypeScript
- 使用 Bun 运行脚本；依赖管理只用 pnpm（唯一 lockfile 是 pnpm-lock.yaml）

## 常用命令

- `pnpm install`
- `bun dev`
- `bun build`
- `bun preview`

## SolidJS 部分的 File Naming

| Type       | Pattern           |
| ---------- | ----------------- |
| Components | `*.component.tsx` |
| Styled     | `*.styled.tsx`    |
| Helpers    | `*-helpers.ts`    |
| Types      | `types.ts`        |
| Hooks      | `use-*.ts`        |
| Constants  | `*.const.ts`      |

## 脚本编写

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `pnpm install` for dependencies — never `bun install`, `npm install`, or `yarn install` (pnpm is the only package manager; never create `bun.lock`)
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

### APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

### Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.mdx`.

## Git/提交规范

- 启用 githooks：`bun setup-githooks`（或 `git config core.hooksPath .githooks`）
- 提交信息使用 Conventional Commits（如 `feat(ui): add sticker filter`）
