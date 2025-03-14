import { UUID } from 'crypto';
import { IPost } from './post.interface';

export interface IComment {
  id: UUID;
  postId: UUID;
  name: string;
  email: string;
  body: string;
  post: IPost;
}
