// server/src/middleware/permission.ts
export const permissionMiddleware = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 임시로 권한 체크 통과
    next();
  };
};