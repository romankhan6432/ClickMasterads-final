interface ApiError {
  error: string;
  status: number;
}

export function handleApiError(error: ApiError): void {
  // Log error to your preferred logging service
  console.error(`API Error [${error.status}]:`, error.error);
}
