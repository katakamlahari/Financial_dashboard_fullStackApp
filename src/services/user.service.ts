import bcrypt from 'bcryptjs';
import userRepository from '@/repositories/user.repository';
import { generateToken, JWTPayload } from '@/utils/jwt';
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/utils/errors';
import { RegisterInput, LoginInput, UpdateUserInput } from '@/schemas/user.schema';

export class UserService {
  async register(input: RegisterInput) {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await userRepository.create({
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      role: 'VIEWER',
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);

    if (!user || user.deletedAt !== null) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('User account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);

    if (!user || user.deletedAt !== null) {
      throw new NotFoundError('User not found');
    }

    return this.sanitizeUser(user);
  }

  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await userRepository.findAll(skip, limit);
    const total = await userRepository.countAll();

    return {
      data: users.map((user) => this.sanitizeUser(user)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateUser(id: string, input: UpdateUserInput) {
    const user = await userRepository.findById(id);

    if (!user || user.deletedAt !== null) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await userRepository.update(id, input);

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return this.sanitizeUser(updatedUser);
  }

  async assignRole(userId: string, role: string) {
    const user = await userRepository.findById(userId);

    if (!user || user.deletedAt !== null) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await userRepository.update(userId, { role });

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return this.sanitizeUser(updatedUser);
  }

  async deactivateUser(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user || user.deletedAt !== null) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await userRepository.update(userId, { isActive: false });

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return this.sanitizeUser(updatedUser);
  }

  async activateUser(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user || user.deletedAt !== null) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await userRepository.update(userId, { isActive: true });

    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return this.sanitizeUser(updatedUser);
  }

  async deleteUser(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user || user.deletedAt !== null) {
      throw new NotFoundError('User not found');
    }

    await userRepository.softDelete(userId);
  }

  private sanitizeUser(user: any) {
    const { password, ...rest } = user;
    return rest;
  }
}

export default new UserService();
