import prisma from '@/utils/database';
import { FinancialRecord } from '@prisma/client';

export interface FilterOptions {
  userId: string;
  type?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  skip: number;
  take: number;
  sortBy: 'date' | 'amount' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export class FinancialRecordRepository {
  async findById(id: string, userId: string): Promise<FinancialRecord | null> {
    return prisma.financialRecord.findFirst({
      where: {
        id,
        createdBy: userId,
        deletedAt: null,
      },
    });
  }

  async findAll(options: FilterOptions): Promise<FinancialRecord[]> {
    const where: any = {
      createdBy: options.userId,
      deletedAt: null,
    };

    if (options.type) {
      where.type = options.type;
    }

    if (options.category) {
      where.category = {
        contains: options.category,
        mode: 'insensitive',
      };
    }

    if (options.startDate || options.endDate) {
      where.date = {};
      if (options.startDate) {
        where.date.gte = options.startDate;
      }
      if (options.endDate) {
        where.date.lte = options.endDate;
      }
    }

    return prisma.financialRecord.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: {
        [options.sortBy]: options.sortOrder,
      },
    });
  }

  async count(options: Omit<FilterOptions, 'skip' | 'take'>): Promise<number> {
    const where: any = {
      createdBy: options.userId,
      deletedAt: null,
    };

    if (options.type) {
      where.type = options.type;
    }

    if (options.category) {
      where.category = {
        contains: options.category,
        mode: 'insensitive',
      };
    }

    if (options.startDate || options.endDate) {
      where.date = {};
      if (options.startDate) {
        where.date.gte = options.startDate;
      }
      if (options.endDate) {
        where.date.lte = options.endDate;
      }
    }

    return prisma.financialRecord.count({ where });
  }

  async create(data: {
    amount: number;
    type: string;
    category: string;
    date: Date;
    notes?: string;
    createdBy: string;
  }): Promise<FinancialRecord> {
    return prisma.financialRecord.create({
      data,
    });
  }

  async update(
    id: string,
    userId: string,
    data: Partial<{
      amount: number;
      type: string;
      category: string;
      date: Date;
      notes: string;
    }>,
  ): Promise<FinancialRecord | null> {
    // First verify the record exists and belongs to the user
    const record = await prisma.financialRecord.findUnique({
      where: { id },
    });

    if (!record || record.createdBy !== userId || record.deletedAt !== null) {
      return null;
    }

    return prisma.financialRecord.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async softDelete(id: string, userId: string): Promise<void> {
    await prisma.financialRecord.updateMany({
      where: {
        id,
        createdBy: userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async getByIdForUpdate(id: string, userId: string): Promise<FinancialRecord | null> {
    return prisma.financialRecord.findFirst({
      where: {
        id,
        createdBy: userId,
        deletedAt: null,
      },
    });
  }

  // Dashboard analytics methods
  async getTotalIncome(userId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const result = await prisma.financialRecord.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        createdBy: userId,
        type: 'INCOME',
        deletedAt: null,
        ...(startDate && endDate && {
          date: {
            gte: startDate,
            lte: endDate,
          },
        }),
      },
    });

    return result._sum.amount || 0;
  }

  async getTotalExpense(userId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const result = await prisma.financialRecord.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        createdBy: userId,
        type: 'EXPENSE',
        deletedAt: null,
        ...(startDate && endDate && {
          date: {
            gte: startDate,
            lte: endDate,
          },
        }),
      },
    });

    return result._sum.amount || 0;
  }

  async getCategoryTotals(userId: string, startDate?: Date, endDate?: Date) {
    return prisma.financialRecord.groupBy({
      by: ['category', 'type'],
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
      where: {
        createdBy: userId,
        deletedAt: null,
        ...(startDate && endDate && {
          date: {
            gte: startDate,
            lte: endDate,
          },
        }),
      },
    });
  }

  async getMonthlyTrends(userId: string, months: number = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const records = await prisma.financialRecord.findMany({
      where: {
        createdBy: userId,
        deletedAt: null,
        date: {
          gte: startDate,
        },
      },
      select: {
        date: true,
        amount: true,
        type: true,
      },
    });

    const trends: Record<string, { income: number; expense: number }> = {};

    records.forEach((record: any) => {
      const yearMonth = record.date.toISOString().slice(0, 7);
      if (!trends[yearMonth]) {
        trends[yearMonth] = { income: 0, expense: 0 };
      }

      if (record.type === 'INCOME') {
        trends[yearMonth].income += record.amount;
      } else {
        trends[yearMonth].expense += record.amount;
      }
    });

    return Object.entries(trends)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        ...data,
      }));
  }

  async getRecentTransactions(userId: string, limit: number = 5): Promise<FinancialRecord[]> {
    return prisma.financialRecord.findMany({
      where: {
        createdBy: userId,
        deletedAt: null,
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
    });
  }
}

export default new FinancialRecordRepository();
