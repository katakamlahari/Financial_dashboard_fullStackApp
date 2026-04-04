import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth.middleware';
import { successResponse, asyncHandler } from '@/middleware/error.middleware';
import recordService from '@/services/record.service';
import {
  CreateFinancialRecordInput,
  UpdateFinancialRecordInput,
  FilterRecordsInput,
} from '@/schemas/record.schema';

export class RecordController {
  createRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const input: CreateFinancialRecordInput = req.body;

    const record = await recordService.createRecord(userId!, input);
    successResponse(res, 201, record, 'Record created successfully');
  });

  getRecordById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const recordId = req.params.id;
    const userId = req.user?.id;

    const record = await recordService.getRecordById(recordId, userId!);
    successResponse(res, 200, record, 'Record retrieved');
  });

  getAllRecords = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const filters: FilterRecordsInput = req.query as any;

    const result = await recordService.getAllRecords(userId!, filters);
    successResponse(res, 200, result, 'Records retrieved');
  });

  updateRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
    const recordId = req.params.id;
    const userId = req.user?.id;
    const input: UpdateFinancialRecordInput = req.body;

    const record = await recordService.updateRecord(recordId, userId!, input);
    successResponse(res, 200, record, 'Record updated successfully');
  });

  deleteRecord = asyncHandler(async (req: AuthRequest, res: Response) => {
    const recordId = req.params.id;
    const userId = req.user?.id;

    await recordService.deleteRecord(recordId, userId!);
    successResponse(res, 200, null, 'Record deleted successfully');
  });

  getDashboardSummary = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user?.id;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined;
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined;

      const summary = await recordService.getDashboardSummary(
        userId!,
        startDate,
        endDate,
      );
      successResponse(res, 200, summary, 'Dashboard summary retrieved');
    },
  );

  getMonthlyTrends = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const months = parseInt((req.query.months as string) || '12', 10);

    const trends = await recordService.getMonthlyTrends(userId!, months);
    successResponse(res, 200, trends, 'Monthly trends retrieved');
  });

  getCategoryBreakdown = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user?.id;
      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined;
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined;

      const breakdown = await recordService.getCategoryBreakdown(
        userId!,
        startDate,
        endDate,
      );
      successResponse(res, 200, breakdown, 'Category breakdown retrieved');
    },
  );

  getSmartInsights = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const insights = await recordService.getSmartInsights(userId!);
    successResponse(res, 200, insights, 'Smart insights retrieved');
  });
}

export default new RecordController();
