import type { AddCommentRequest, ApiResponse, CommentPost, CommentResponse } from "./types";

function endpoint(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

async function request<T>(baseUrl: string, path: string, body: unknown): Promise<T> {
  const response = await fetch(endpoint(baseUrl, path), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`评论服务返回 ${response.status}`);
  }

  const result = (await response.json()) as ApiResponse<T>;
  if (result.code >= 400) {
    throw new Error("评论服务拒绝了请求");
  }
  return result.data;
}

export function getComments(baseUrl: string, slug: string): Promise<CommentResponse> {
  return request(baseUrl, "/public/posts/bySlug", { slug });
}

export function addComment(baseUrl: string, body: AddCommentRequest): Promise<CommentPost> {
  return request(baseUrl, "/public/posts/add", body);
}
