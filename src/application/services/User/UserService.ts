import { IUser, IUserAddress } from '@/domain/models';
import { IRepository } from '@/infrastructure/repositories/GenericRepository';
import { AppError } from '@/interface/middleware/error/error';

export class UserService {
  private userRepository: IRepository<IUser>;
  private addressRepository: IRepository<IUserAddress>;

  constructor(userRepository: IRepository<IUser>,
    addressRepository: IRepository<IUserAddress>,
  ) {
    this.userRepository = userRepository;
    this.addressRepository = addressRepository;
  }
  getUserById = async (userId: string): Promise<IUser | null> => {
    const user = this.userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }
  updateUser = async (
    userId: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null> => {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    const updatedUser = await this.userRepository.updateById(
      userId,
      updateData,
    );
    return updatedUser;
  }
  deleteUser = async (userId: string): Promise<boolean> => {
    const result = await this.userRepository.deleteById(userId);
    if (!result) throw new AppError('User not found', 404);
    return true;
  }
  addUserAddress = async (
    userId: string,
    addressData: Partial<IUser>,
  ): Promise<IUserAddress | null> => {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    const newAddress = await this.addressRepository.create({
      ...addressData,
      userId: user._id,
    });
    if (!newAddress) throw new AppError('Failed to add address', 500);
    return newAddress;

  }
  getUserAddresses = async (userId: string): Promise<IUserAddress[]> => {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    const addresses = await this.addressRepository.findMany({ userId: user._id });
    return addresses;
  }
}
