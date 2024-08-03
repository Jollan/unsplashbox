export interface Metadata {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export type JsonResponse<T> = { status: 'success'; data: T };
