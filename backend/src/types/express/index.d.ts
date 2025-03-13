import { User } from '../../users/user.entity'; // Adjust the import based on your project structure

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
