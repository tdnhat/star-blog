import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: "/api/v1/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                
                // First try to find user by OAuth ID or email
                let user = await User.findOne({
                    $or: [
                        { oauthId: profile.id },
                        { email: email, oauthId: { $exists: false } }
                    ]
                });

                if (user) {
                    // Update OAuth details if user was found by email
                    if (!user.oauthId) {
                        user.oauthProvider = "google";
                        user.oauthId = profile.id;
                        user.isVerified = true;
                        user.verificationToken = null;
                        await user.save();
                    }
                } else {
                    // Create new user if none exists
                    user = await User.create({
                        oauthProvider: "google",
                        oauthId: profile.id,
                        username: profile.displayName,
                        email: email,
                        isVerified: true,
                        verificationToken: null,
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }    )
);

export default passport;
