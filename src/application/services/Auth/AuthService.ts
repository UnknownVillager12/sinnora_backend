import { IUser } from '@/domain/models';
import { JwtService } from './JwtService';
import { AppError } from '@/interface/middleware/error/error';
import { IRepository } from '@/infrastructure/repositories/GenericRepository';

export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepository: IRepository<IUser>,
  ) {}
  async signup(userData: Partial<IUser>): Promise<IUser> {
    const existingUser = await this.userRepository.findOne({
      phoneNumber: userData.phoneNumber,
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const newUser = await this.userRepository.create({
      ...userData,
      phoneNumber: userData.phoneNumber,
      role: 'customer',
      isActive: true,
      emailVerified: false,
    });

    const accessToken = this.jwtService.createAccessToken(
      newUser._id.toString(),
    );
    const refreshToken = this.jwtService.createRefreshToken(
      newUser._id.toString(),
    );
    newUser.accessToken = accessToken;
    newUser.refreshToken = refreshToken;

    return newUser;
  }
  async login(loginCredentials: Partial<IUser>): Promise<IUser> {
    const { phoneNumber } = loginCredentials;
    let user = await this.userRepository.findOne({ phoneNumber });
    if (!user)
      throw new AppError('User not found with the provided phone number', 404);
      // user = await this.userRepository.create({
      //   ...loginCredentials,
      //   email: loginCredentials.email,
      //   role: 'customer',
      //   isActive: true,
      //   emailVerified: false,
      // });
    // pending: add password hashing
    // if (password && !(await bcrypt.compare(password, user.password)))
    //   throw new AppError('Invalid credentials', 404);
    // if (password !== user.password) throw new AppError('Invalid credentials', 401);
    // if (!user.isActive) throw new AppError('User is inactive', 403);
    const accessToken = this.jwtService.createAccessToken(String(user._id));
    const refreshToken = this.jwtService.createRefreshToken(String(user._id));
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    return user;
  }
  async refreshAccessToken(refreshToken: string): Promise<string> {
    const newAccessToken =
      this.jwtService.exchangeRefreshTokenForAccess(refreshToken);
    if (!newAccessToken) throw new AppError('Invalid refresh token', 401);
    return newAccessToken;
  }
}
