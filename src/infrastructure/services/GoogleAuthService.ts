import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import config from 'config';
import { injectable } from 'inversify';

import user from '../database/models/UserModel';
import { JwtService } from './JwtService'; 
import { IGoogleAuthService } from 'domain/services/IGoogleAuthService';

@injectable()
export class GoogleAuthServiceImpl implements IGoogleAuthService {
  
  initializeStrategy(): void {
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.GOOGLE_CLIENT_ID,
          clientSecret: config.GOOGLE_CLIENT_SECRET,
          callbackURL: 'http://localhost:5000/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let userDoc = await user.findOne({ email: profile.emails?.[0].value });

            if (!userDoc) {
              userDoc = await user.create({
                googleId: profile.id,
                email: profile.emails?.[0].value,
                name: profile.displayName,
                verified: true,
                status: true
              });
            }

              const accessToken = JwtService.generateAccessToken({
                id: String(userDoc._id),
                email: userDoc.email,
                role: 'user'
              });

            done(null, { user: userDoc, accessToken });

          } catch (error) {
            done(error as Error, undefined);
          }
        }
      )
    );
  }
}
