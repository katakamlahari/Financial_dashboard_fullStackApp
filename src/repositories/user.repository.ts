import prisma from '@/utils/database';
import { User } from '@prisma/client';

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(skip: number = 0, take: number = 10): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        ...data,
        role: data.role || 'VIEWER',
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      role: string;
      isActive: boolean;
    }>,
  ): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async softDelete(id: string): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(id: string): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }

  async countAll(): Promise<number> {
    return prisma.user.count({
      where: {
        deletedAt: null,
      },
    });
  }
}

export default new UserRepository();
