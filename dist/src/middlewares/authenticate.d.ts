import type { Request, Response, NextFunction } from "express";
export interface AuthTokenPayload {
    userId: number;
    roleId: number;
    permissions: string[];
}
declare global {
    namespace Express {
        interface Request {
            auth?: AuthTokenPayload;
        }
    }
}
export declare function authenticate(request: Request, response: Response, next: NextFunction): void;
//# sourceMappingURL=authenticate.d.ts.map