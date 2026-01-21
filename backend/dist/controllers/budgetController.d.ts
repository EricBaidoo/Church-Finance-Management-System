import { Request, Response } from 'express';
export declare const getBudgets: (req: Request, res: Response) => Promise<void>;
export declare const createBudget: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getBudget: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateBudget: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteBudget: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=budgetController.d.ts.map