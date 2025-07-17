import { RequestHandler } from 'express';
export declare const permissionMiddleware: (resource: string, action: string) => RequestHandler;
