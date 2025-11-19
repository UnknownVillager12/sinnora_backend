import { IReview } from '@/domain/models/Review';
import { IRepository } from '@/infrastructure/repositories/GenericRepository';

export class ReviewService {
  constructor(private reviewRepository: IRepository<IReview>) {}
  async createReview(reviewData: Partial<IReview>): Promise<IReview> {
    const review = await this.reviewRepository.create(reviewData);
    return review;
  }
  async getReviewsByProductId(productId: string): Promise<IReview[]> {
    return this.reviewRepository.findMany({ productId });
  }
  async approveReview(reviewId: string): Promise<IReview | null> {
    return this.reviewRepository.updateById(reviewId, { isApproved: true });
  }
}
