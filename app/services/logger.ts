// This is just to avoid more dependencies, and keep it simple
export function logRequest(method: string, endpoint: string, logData: string) {
  console.log(
    `[${method.toUpperCase()} ${endpoint}] request data: ${logData} at ${new Date().toISOString()}`
  );
}

export function logResponse(
  statusCode: number,
  statusText: string,
  logData: string
) {
  console.log(
    `[${statusCode} ${statusText}] response data: ${logData} at ${new Date().toISOString()}`
  );
}
