import { Router } from 'express';
import { UserController } from '../controllers';
import { AuthService, JwtService } from '@/application/services';
import { RepositoryFactory } from '@/infrastructure/repositories/GenericRepository';
import { User, UserAddress } from '@/domain/models';
import {
  CreateUserDto,
  UserLoginDto,
  UserResponseDto,
} from '@/application/dtos/user.dto';
import { UserService } from '@/application/services/User/UserService';
import { UseRequestDto, UseResponseDto } from '../middleware/validation';
const userRepository = RepositoryFactory.createFull(User);
const jwtService = new JwtService();
const authService = new AuthService(jwtService, userRepository);
const addressRepository = RepositoryFactory.createFull(UserAddress);
const userService = new UserService(userRepository, addressRepository);
const userController = new UserController(authService,userService);
const router = Router();

router
  .route('/')
  .post(
    UseRequestDto(CreateUserDto),
    UseResponseDto(UserResponseDto),
    userController.signupUser,
  );
router
  .route('/login')
  .post(
    UseRequestDto(UserLoginDto),
    UseResponseDto(UserResponseDto),
    userController.loginUser,
  );
router.route('/refresh-token').post(userController.refreshAccessToken);

// address routes

router.route('/address').post(userController.addUserAddress);
router.route('/address/:userId').get(userController.getAddressByUserId);
export default router;
