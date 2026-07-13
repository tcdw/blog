/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  grecaptcha?: {
    ready(callback: () => void): void;
    execute(siteKey: string, options: { action: string }): Promise<string>;
  };
}
