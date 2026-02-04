type FetchOptions = RequestInit & {
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer';
};

async function http<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { responseType = 'json', ...fetchOptions } = options;

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
  }

  let data: unknown;
  switch (responseType) {
    case 'json':
      data = await response.json();
      break;
    case 'text':
      data = await response.text();
      break;
    case 'blob':
      data = await response.blob();
      break;
    case 'arrayBuffer':
      data = await response.arrayBuffer();
      break;
    default:
      data = await response.json();
  }

  return data as T;
}

export const httpClient = {
  get: <T>(url: string, options: Omit<FetchOptions, 'body' | 'method'> = {}) => {
    return http<T>(url, { ...options, method: 'GET' });
  },
  post: <T>(url: string, body: unknown, options: Omit<FetchOptions, 'body' | 'method'> = {}) => {
    const isFormData = body instanceof FormData;
    return http<T>(url, { 
      ...options, 
      method: 'POST', 
      body: isFormData ? body : JSON.stringify(body),
      headers: isFormData ? options.headers : { 'Content-Type': 'application/json', ...options.headers }
    });
  },
  getRaw: (url: string, options: Omit<FetchOptions, 'body' | 'method'> = {}) => {
    return fetch(url, { ...options, method: 'GET' });
  }
};
