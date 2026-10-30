export function routeContext(id: number | string) {
  return { params: Promise.resolve({ id: String(id) }) };
}

export async function parseResponse<T = unknown>(res: Response) {
  const json = (await res.json()) as T;
  return { status: res.status, json };
}

export const baseUrl = "http://localhost/api";
