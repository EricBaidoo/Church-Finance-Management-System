import { Request, Response } from 'express';
export declare const getDonations: (req: Request, res: Response) => Promise<void>;
export declare const createDonation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDonation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateDonation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteDonation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=donationController.d.ts.map