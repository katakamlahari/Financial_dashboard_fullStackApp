import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth.middleware';
import { successResponse, asyncHandler } from '@/middleware/error.middleware';
import userService from '@/services/user.service';
import { RegisterInput, LoginInput, UpdateUserInput } from '@/schemas/user.schema';

export class UserController {
  register = asyncHandler(async (req: AuthRequest, res: Response) => {
    const input: RegisterInput = req.body;
    const result = await userService.register(input);
    successResponse(res, 201, result, 'User registered successfully');
  });

  login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const input: LoginInput = req.body;
    const result = await userService.login(input);
    successResponse(res, 200, result, 'Login successful');
  });

  getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const user = await userService.getUserById(userId!);
    successResponse(res, 200, user, 'User profile retrieved');
  });

  getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '10', 10);

    const result = await userService.getAllUsers(page, limit);
    successResponse(res, 200, result, 'Users retrieved');
  });

  updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;
    const input: UpdateUserInput = req.body;

    const result = await userService.updateUser(userId, input);
    successResponse(res, 200, result, 'User updated successfully');
  });

  assignRole = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;
    const { role } = req.body;

    const result = await userService.assignRole(userId, role);
    successResponse(res, 200, result, 'Role assigned successfully');
  });

  deactivateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;

    await userService.deactivateUser(userId);
    successResponse(res, 200, null, 'User deactivated successfully');
  });

  activateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;

    await userService.activateUser(userId);
    successResponse(res, 200, null, 'User activated successfully');
  });

  deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;

    await userService.deleteUser(userId);
    successResponse(res, 200, null, 'User deleted successfully');
  });
}

export default new UserController();
