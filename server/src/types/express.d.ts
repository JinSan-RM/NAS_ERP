// server/src/types/express.d.ts
declare namespace Express {
  interface Request {
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
      department: string;
    };
  }
}