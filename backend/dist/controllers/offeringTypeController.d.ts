import { Request, Response } from 'express';
export declare const getOfferingTypes: (req: Request, res: Response) => Promise<void>;
export declare const createOfferingType: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getOfferingType: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateOfferingType: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteOfferingType: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getActiveOfferingTypes: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=offeringTypeController.d.ts.map