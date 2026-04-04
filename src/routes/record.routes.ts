import { Router } from 'express';
import recordController from '@/controllers/record.controller';
import { authMiddleware, roleMiddleware } from '@/middleware/auth.middleware';
import { validateRequest, validateQuery } from '@/middleware/validation.middleware';
import {
  createFinancialRecordSchema,
  updateFinancialRecordSchema,
  filterRecordsSchema,
} from '@/schemas/record.schema';

const recordRouter = Router();

// All record routes require authentication
recordRouter.use(authMiddleware);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a new financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Record created successfully
 *       400:
 *         description: Validation error
 */
recordRouter.post(
  '/',
  validateRequest(createFinancialRecordSchema),
  recordController.createRecord,
);

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all financial records with filters
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, amount, createdAt]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Records list
 *       401:
 *         description: Unauthorized
 */
recordRouter.get(
  '/',
  validateQuery(filterRecordsSchema),
  recordController.getAllRecords,
);

/**
 * @swagger
 * /api/records/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary (total income, expense, net balance)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Dashboard summary
 *       401:
 *         description: Unauthorized
 */
recordRouter.get('/dashboard/summary', recordController.getDashboardSummary);

/**
 * @swagger
 * /api/records/dashboard/monthly-trends:
 *   get:
 *     summary: Get monthly trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Monthly trends data
 */
recordRouter.get('/dashboard/monthly-trends', recordController.getMonthlyTrends);

/**
 * @swagger
 * /api/records/dashboard/category-breakdown:
 *   get:
 *     summary: Get category breakdown
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Category breakdown
 */
recordRouter.get(
  '/dashboard/category-breakdown',
  recordController.getCategoryBreakdown,
);

/**
 * @swagger
 * /api/records/dashboard/insights:
 *   get:
 *     summary: Get smart insights (spending trends, alerts, etc)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Smart insights
 */
recordRouter.get(
  '/dashboard/insights',
  recordController.getSmartInsights,
);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get a specific financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record details
 *       404:
 *         description: Record not found
 */
recordRouter.get('/:id', recordController.getRecordById);

/**
 * @swagger
 * /api/records/{id}:
 *   put:
 *     summary: Update a financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated
 *       404:
 *         description: Record not found
 */
recordRouter.put(
  '/:id',
  validateRequest(updateFinancialRecordSchema),
  recordController.updateRecord,
);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Delete a financial record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted
 *       404:
 *         description: Record not found
 */
recordRouter.delete('/:id', recordController.deleteRecord);

export default recordRouter;
