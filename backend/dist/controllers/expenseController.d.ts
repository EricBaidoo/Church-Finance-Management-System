import { Request, Response } from 'express';
export declare const getExpenses: (req: Request, res: Response) => Promise<void>;
export declare const createExpense: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getExpense: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateExpense: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const approveExpense: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const rejectExpense: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteExpense: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getExpenseStats: (req: Request, res: Response) => Promise<void>;
export declare const getExpenseTrends: (req: Request, res: Response) => Promise<void>;
export declare const getPendingExpenses: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=expenseController.d.ts.map