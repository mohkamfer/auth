import { NextFunction, Request, Response } from "express"

export const handle404 = (request: Request, response: Response, next: NextFunction) => {
  const { method, originalUrl } = request;
  console.log({ method, originalUrl }, `Unhandled API request ${method} ${originalUrl}`)
  response.status(404).json({ error: 'Resource not found or unsupported HTTP method' })
}
