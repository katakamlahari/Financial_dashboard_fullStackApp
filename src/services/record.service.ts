import recordRepository, { FilterOptions } from '@/repositories/record.repository';
import { NotFoundError } from '@/utils/errors';
import {
  CreateFinancialRecordInput,
  UpdateFinancialRecordInput,
  FilterRecordsInput,
} from '@/schemas/record.schema';

export class RecordService {
  async createRecord(userId: string, input: CreateFinancialRecordInput) {
    const dateObj =
      input.date instanceof Date ? input.date : new Date(input.date);

    const record = await recordRepository.create({
      amount: input.amount,
      type: input.type,
      category: input.category,
      date: dateObj,
      notes: input.notes,
      createdBy: userId,
    });

    return record;
  }

  async getRecordById(recordId: string, userId: string) {
    const record = await recordRepository.findById(recordId, userId);

    if (!record) {
      throw new NotFoundError('Record not found');
    }

    return record;
  }

  async getAllRecords(userId: string, filters: FilterRecordsInput) {
    const options: FilterOptions = {
      userId,
      type: filters.type,
      category: filters.category,
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };

    const [records, total] = await Promise.all([
      recordRepository.findAll(options),
      recordRepository.count({
        userId,
        type: options.type,
        category: options.category,
        startDate: options.startDate,
        endDate: options.endDate,
        sortBy: options.sortBy,
        sortOrder: options.sortOrder,
      }),
    ]);

    return {
      data: records,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        pages: Math.ceil(total / filters.limit),
      },
    };
  }

  async updateRecord(
    recordId: string,
    userId: string,
    input: UpdateFinancialRecordInput,
  ) {
    const record = await recordRepository.getByIdForUpdate(recordId, userId);

    if (!record) {
      throw new NotFoundError('Record not found');
    }

    const updateData: any = {};

    if (input.amount !== undefined) {
      updateData.amount = input.amount;
    }

    if (input.type !== undefined) {
      updateData.type = input.type;
    }

    if (input.category !== undefined) {
      updateData.category = input.category;
    }

    if (input.date !== undefined) {
      updateData.date =
        input.date instanceof Date ? input.date : new Date(input.date);
    }

    if (input.notes !== undefined) {
      updateData.notes = input.notes;
    }

    await recordRepository.update(recordId, userId, updateData);

    const updatedRecord = await recordRepository.findById(recordId, userId);
    if (!updatedRecord) {
      throw new NotFoundError('Record not found');
    }

    return updatedRecord;
  }

  async deleteRecord(recordId: string, userId: string) {
    const record = await recordRepository.findById(recordId, userId);

    if (!record) {
      throw new NotFoundError('Record not found');
    }

    await recordRepository.softDelete(recordId, userId);
  }

  async getDashboardSummary(userId: string, startDate?: Date, endDate?: Date) {
    const [totalIncome, totalExpense, categoryTotals, recentTransactions] =
      await Promise.all([
        recordRepository.getTotalIncome(userId, startDate, endDate),
        recordRepository.getTotalExpense(userId, startDate, endDate),
        recordRepository.getCategoryTotals(userId, startDate, endDate),
        recordRepository.getRecentTransactions(userId, 5),
      ]);

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      categoryTotals,
      recentTransactions,
    };
  }

  async getMonthlyTrends(userId: string, months: number = 12) {
    return recordRepository.getMonthlyTrends(userId, months);
  }

  async getCategoryBreakdown(userId: string, startDate?: Date, endDate?: Date) {
    const categoryTotals = await recordRepository.getCategoryTotals(
      userId,
      startDate,
      endDate,
    );

    return categoryTotals.map((item: { category: string; type: string; _sum: { amount: number | null }; _count: { id: number } }) => ({
      category: item.category,
      type: item.type,
      total: item._sum.amount,
      count: item._count.id,
    }));
  }

  async getSmartInsights(userId: string) {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [currentMonth, lastMonth, allRecords] = await Promise.all([
      recordRepository.findAll({
        userId,
        startDate: currentMonthStart,
        skip: 0,
        take: 999,
        sortBy: 'date',
        sortOrder: 'asc',
      }),
      recordRepository.findAll({
        userId,
        startDate: lastMonthStart,
        endDate: lastMonthEnd,
        skip: 0,
        take: 999,
        sortBy: 'date',
        sortOrder: 'asc',
      }),
      recordRepository.findAll({
        userId,
        skip: 0,
        take: 999,
        sortBy: 'date',
        sortOrder: 'asc',
      }),
    ]);

    const currentMonthExpense = currentMonth
      .filter(r => r.type === 'EXPENSE')
      .reduce((sum, r) => sum + r.amount, 0);
    const currentMonthIncome = currentMonth
      .filter(r => r.type === 'INCOME')
      .reduce((sum, r) => sum + r.amount, 0);

    const lastMonthExpense = lastMonth
      .filter(r => r.type === 'EXPENSE')
      .reduce((sum, r) => sum + r.amount, 0);
    const lastMonthIncome = lastMonth
      .filter(r => r.type === 'INCOME')
      .reduce((sum, r) => sum + r.amount, 0);

    const totalExpense = allRecords
      .filter(r => r.type === 'EXPENSE')
      .reduce((sum, r) => sum + r.amount, 0);
    const totalRecords = allRecords.length;

    const categorySpending: { [key: string]: number } = {};
    currentMonth
      .filter(r => r.type === 'EXPENSE')
      .forEach(r => {
        categorySpending[r.category] = (categorySpending[r.category] || 0) + r.amount;
      });

    const topCategory = Object.entries(categorySpending).sort(
      (a, b) => (b[1] as number) - (a[1] as number)
    )[0];

    const averageDailySpending = totalRecords > 0 
      ? totalExpense / Math.ceil((now.getTime() - (allRecords[0]?.createdAt?.getTime() || now.getTime())) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      highestSpendingCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] as number } : null,
      averageDailySpending: Math.round(averageDailySpending * 100) / 100,
      currentMonthExpense,
      currentMonthIncome,
      lastMonthExpense,
      lastMonthIncome,
      monthOverMonthChange: {
        expense: Math.round(((currentMonthExpense - lastMonthExpense) / (lastMonthExpense || 1)) * 100),
        income: Math.round(((currentMonthIncome - lastMonthIncome) / (lastMonthIncome || 1)) * 100),
      },
      expensesExceedIncome: currentMonthExpense > currentMonthIncome,
      savingsRate: currentMonthIncome > 0
        ? Math.round(((currentMonthIncome - currentMonthExpense) / currentMonthIncome) * 100)
        : 0,
    };
  }
}

export default new RecordService();
