import { AuthService, UserService } from '@/application/services';
import { Request, Response } from 'express';

export class UserController {
  private authService: AuthService;
  private userService: UserService;

  constructor(authService: AuthService,
    userService: UserService
  ) {
    this.authService = authService;
    this.userService = userService
  }
  signupUser = async (req: Request, res: Response) => {
    const userData = req.body;
    const newUser = await this.authService.signup(userData);
    return res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully',
    });
  };
  loginUser = async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;
    const loginResponse = await this.authService.login({
      phoneNumber: `+91${phoneNumber}`,
    });
    return res.status(200).json(loginResponse);
  };
  refreshAccessToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const newAccessToken =
      await this.authService.refreshAccessToken(refreshToken);
    return res.status(200).json({ accessToken: newAccessToken });
  };
  addUserAddress = async (req: any, res: Response) => {
    const userId = req.user?._id;
    const addressData = req.body;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const updatedUser = await this.userService.addUserAddress(
      userId,
      addressData,
    );
    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Address added successfully',
    });
  }
  getAddressByUserId = async (req: any, res: Response) => {
    const userId = req.params.userId || req.user?._id;
    const addresses = await this.userService.getUserAddresses(userId);
    return res.status(200).json({
      success: true,
      data: addresses,
      message: 'User addresses fetched successfully',
    });
  }
}
