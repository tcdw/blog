export interface CommentMeta {
  title: string;
  firstPostAt: number;
  latestPostAt: number;
  amount: number;
  id: number;
  locked: boolean;
  slug: string;
  url: string;
}

export interface CommentPost {
  id: number;
  name: string;
  emailHashed: string;
  website: string;
  parent: number;
  parentPost?: CommentPost;
  content: string;
  hidden: boolean;
  byAdmin: boolean;
  createdAt: number;
  updatedAt: number;
  avatar: string;
}

export interface CommentThread {
  parentPost: CommentPost;
  childPost: CommentPost[];
}

export interface AddCommentRequest {
  slug: string;
  url: string;
  title: string;
  name: string;
  email: string;
  website?: string;
  content: string;
  receiveEmail: boolean;
  parent?: number;
  challengeResponse?: string;
}

export interface CommentResponse {
  meta: CommentMeta;
  post: CommentPost[];
}

export interface ApiResponse<T> {
  code: number;
  data: T;
}
