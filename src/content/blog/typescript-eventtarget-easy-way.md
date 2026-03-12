---
title: '【更正版】简单实现类型安全的、能触发 CustomEvent 的 EventTarget'
description: '我想写一个 TypeScript 类，这个类提供一系列的事件可供监听。为了实现类型安全，改进开发体验，我自己研究了一下，实现了一个可以以泛型输入所有可能的事件类型的 TypedEventTarget 类。'
pubDate: '2024-03-31T15:59:24.000Z'
updatedDate: '2024-07-18T09:29:10.000Z'
---

我想写一个 TypeScript 类，这个类提供一系列的事件可供监听。为了实现类型安全，改进开发体验，我自己研究了一下，实现了一个可以以泛型输入所有可能的事件类型的 TypedEventTarget 类。

经过 JackWorks 的指正，代码改成了这样。

`typed-event-target.d.ts` 文件内容：

```typescript
export class TypedEventTarget<T> extends EventTarget {
    // 这个类型体操是我从 `lib.dom.d.ts` 抄的我会乱说（
    addEventListener<K extends keyof T>(
        type: K,
        listener: (this: TypedEventTarget<T>, ev: TypedCustomEvent<K, T[K]>) => any,
        options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof T>(
        type: K,
        listener: (this: TypedEventTarget<T>, ev: TypedCustomEvent<K, T[K]>) => any,
        options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
    ): void;
    dispatchEvent<K extends keyof T>(event: TypedCustomEvent<K, T[K]>): void;
}

export class TypedCustomEvent<S, T> extends CustomEvent<T> {
    constructor(type: S, eventInitDict?: CustomEventInit<T> | undefined);
}
```

`typed-event-target.js` 文件内容：

```javascript
// 这里我们小小的欺骗了一下 tsc。
// 在运行时下，这个 EventTarget 其实就是原来的 EventTarget，
// 而非从 EventTarget 继承出来的类。这样可以避免非必要的性能开销。
export const TypedEventTarget = EventTarget;
export const TypedCustomEvent = CustomEvent;
```

将这两个文件同时放在一个合适的目录下，就搞定了！

## 使用方法

我们想要写一个 `Person` 类，这个类有 `nameChange` 和 `ageChange` 这两个自定义事件。那么，我们可以这么写：

```typescript
import { TypedEventTarget, TypedCustomEvent } from "@/utils/typed-event-target"; // 请根据项目实际情况修改路径

// 创建 Person 类的事件表
export interface PersonEventMap {
    nameChange: string;
    ageChange: number;
}

export default class Person extends TypedEventTarget<PersonEventMap> {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        super();
        this.name = name;
        this.age = age;
    }

    setName(name: string) {
        this.name = name;
        // 在使用 dispatchEvent 时，如果类型不正确，会出现错误
        this.dispatchEvent<"nameChange">(
            new CustomEvent("nameChange", {
                detail: name,
            }),
        );
    }

    setAge(age: number) {
        this.age = age;
        this.dispatchEvent<"ageChange">(
            new CustomEvent("ageChange", {
                detail: age,
            }),
        );
    }
}
```

调用这个类时，我们绑定事件也会有正确的补全提示和类型检查。

<details><summary>本博文的上一个版本</summary>

<p>我想写一个 TypeScript 类，这个类提供一系列的事件可供监听。为了实现类型安全，改进开发体验，我自己研究了一下，实现了一个可以以泛型输入所有可能的事件类型的 TypedEventTarget 类。</p>

<p>废话不多说，直接上代码。</p>
<p><code>typed-event-target.d.ts</code> 文件内容：</p>
<pre><code class="language-typescript">export default class TypedEventTarget&lt;T&gt; extends EventTarget {
    // 这个类型体操是我从 `lib.dom.d.ts` 抄的我会乱说（
    addEventListener&lt;K extends keyof T&gt;(
        type: K,
        listener: (this: TypedEventTarget, ev: T[K]) =&gt; any,
        options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener&lt;K extends keyof T&gt;(
        type: K,
        listener: (this: TypedEventTarget, ev: T[K]) =&gt; any,
        options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
    ): void;
    dispatchEvent&lt;K extends keyof T&gt;(event: T[K]): void;
}
</code></pre>
<p><code>typed-event-target.js</code> 文件内容：</p>
<pre><code class="language-javascript">// 这里我们小小的欺骗了一下 tsc。
// 在运行时下，这个 EventTarget 其实就是原来的 EventTarget，
// 而非从 EventTarget 继承出来的类。这样可以避免非必要的性能开销。
export default EventTarget;
</code></pre>
<p>将这两个文件同时放在一个合适的目录下，就搞定了！</p>
<h2 id="使用方法-1">使用方法</h2>
<p>我们想要写一个 <code>Person</code> 类，这个类有 <code>nameChange</code> 和 <code>ageChange</code> 这两个自定义事件。那么，我们可以这么写：</p>
<pre><code class="language-typescript">import TypedEventTarget from "@/utils/typed-event-target"; // 请根据项目实际情况修改路径

// 创建 Person 类的事件表
export interface PersonEventMap {
    nameChange: CustomEvent&lt;string&gt;;
    ageChange: CustomEvent&lt;number&gt;;
}

export default class Person extends TypedEventTarget&lt;PersonEventMap&gt; {
    name: string;
    age: number;
    
    constructor(name: string, age: number) {
        super();
        this.name = name;
        this.age = age;
    }
    
    setName(name: string) {
        this.name = name;
        // 在使用 dispatchEvent 时，如果类型不正确，会出现错误
        this.dispatchEvent&lt;"nameChange"&gt;(
            new CustomEvent("nameChange", {
                detail: name,
            }),
        );
    }
        
    setAge(age: number) {
        this.age = age;
        this.dispatchEvent&lt;"ageChange"&gt;(
            new CustomEvent("ageChange", {
                detail: age,
            }),
        );
    }
}
</code></pre>
<p>调用这个类时，我们绑定事件也会有正确的补全提示和类型检查：</p>
<figure>
  <img src="https://file.tcdw.net/blog-res/2024/type-hint-1.webp" alt="类型提示">
    <figcaption>在调用 addEventListener 事件时，会提供准确的名称提示。</figcaption>
</figure>

<figure>
  <img src="https://file.tcdw.net/blog-res/2024/type-hint-2.webp" alt="类型提示">
    <figcaption>调用事件的详情内容时，推导出来的类型也是准确的。</figcaption>
</figure></details>


<iframe width="560" height="315" src="https://www.youtube.com/embed/3TYDBtJBxRw?si=waQibB33GtJKhC8n" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
