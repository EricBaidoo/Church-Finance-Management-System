import { Request, Response } from 'express';
export declare const getReports: (req: Request, res: Response) => Promise<void>;
export declare const generateReport: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getReport: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDashboard: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=reportController.d.ts.map