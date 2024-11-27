import bcrypt from 'bcrypt';
import { jwtUtils } from '../utilis/jwtUtilis';
import { userRepository } from '../repositories/userRepository';

export const authService = {
  async login(email: string, password: string): Promise<string> {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials'); 
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials'); 
    }

    return jwtUtils.generateToken({ id: user.id, email: user.email });
  },
};
