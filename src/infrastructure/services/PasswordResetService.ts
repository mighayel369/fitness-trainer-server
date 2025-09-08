import { IPasswordResetService } from "domain/services/IPasswordResetService";
import user from "infrastructure/database/models/UserModel";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { injectable } from 'inversify';
@injectable()
export class PasswordResetServiceImpl implements IPasswordResetService {

  async generateResetToken(email: string): Promise<string> {
    const userExist = await user.findOne({ email });
    if (!userExist) {
      throw new Error('User not found');
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    userExist.passwordResetToken = hashed;
    userExist.passwordResetExpires = Date.now() + 1000 * 60 * 15;
    await userExist.save();

    return token;  
  }

async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; role?: string }> {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const userExist = await user.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!userExist) {
    return { success: false };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  userExist.password = hashedPassword;
  userExist.passwordResetToken = undefined;
  userExist.passwordResetExpires = undefined;

  await userExist.save();

  return { success: true, role: userExist.role };
}
}
