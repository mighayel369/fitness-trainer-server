import bcrypt from 'bcryptjs';
import { IPasswordHasher } from 'domain/services/IPasswordHasher';
import { injectable } from 'inversify';
@injectable()
export class PasswordHasherImpl implements IPasswordHasher {

  async hash(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
