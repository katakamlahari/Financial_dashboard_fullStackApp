import { z } from 'zod';

export const createFinancialRecordSchema = z.object({
  amount: z.number().positive('Amount must be a positive number'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    errorMap: () => ({ message: 'Type must be INCOME or EXPENSE' }),
  }),
  category: z.string().min(1, 'Category is required').max(100),
  date: z.string().datetime().or(z.date()),
  notes: z.string().optional(),
});

export const updateFinancialRecordSchema = z.object({
  amount: z.number().positive('Amount must be a positive number').optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  category: z.string().min(1).max(100).optional(),
  date: z.string().datetime().or(z.date()).optional(),
  notes: z.string().optional(),
});

export const filterRecordsSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  category: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.string().default('1').transform(Number),
  limit: z.string().default('10').transform(Number),
  sortBy: z.enum(['date', 'amount', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateFinancialRecordInput = z.infer<
  typeof createFinancialRecordSchema
>;
export type UpdateFinancialRecordInput = z.infer<
  typeof updateFinancialRecordSchema
>;
export type FilterRecordsInput = z.infer<typeof filterRecordsSchema>;
