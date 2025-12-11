declare module '@vercel/node' {
  import type { VercelRequest, VercelResponse } from '@vercel/node';

  export type VercelRequest = VercelRequest;
  export type VercelResponse = VercelResponse;
}