import passport from "passport";
import { Strategy as DiscordStrategy, DiscordProfile } from "discord-strategy";
import { getDatabase } from "../app";
import { IUser, IUserInput, UserRole } from "@nethercore/database";

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      callbackURL: process.env.DISCORD_CALLBACK_URL!,
      scope: ["identify", "email", "guilds"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: DiscordProfile,
      done: (error: any, user?: any) => void
    ) => {
      try {
        const db = getDatabase();
        const supabase = db.getClient();

        const discordId = profile.id;
        const discordUsername = profile.username;
        const discordAvatar = profile.avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${
              parseInt(profile.discriminator) % 5
            }.png`;

        const tokenExpiresAt = new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString();

        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("discord_id", discordId)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error fetching user:", fetchError);
          return done(fetchError, null);
        }

        if (existingUser) {
          const { data: updatedUser, error: updateError } = await supabase
            .from("users")
            .update({
              discord_username: discordUsername,
              discord_avatar: discordAvatar,
              discord_access_token: accessToken,
              discord_refresh_token: refreshToken,
              discord_token_expires_at: tokenExpiresAt,
              updated_at: new Date().toISOString(),
            })
            .eq("discord_id", discordId)
            .select()
            .single();

          if (updateError) {
            console.error("Error updating user:", updateError);
            return done(updateError, null);
          }

          return done(null, updatedUser);
        } else {
          const newUserInput: IUserInput = {
            discord_id: discordId,
            discord_username: discordUsername,
            discord_avatar: discordAvatar,
            discord_access_token: accessToken,
            discord_refresh_token: refreshToken,
            discord_token_expires_at: tokenExpiresAt,
            role: UserRole.USER,
          };

          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert(newUserInput)
            .select()
            .single();

          if (insertError) {
            console.error("Error creating user:", insertError);
            return done(insertError, null);
          }

          return done(null, newUser);
        }
      } catch (error) {
        console.error("Passport strategy error:", error);
        return done(error, null);
      }
    }
  )
);

// serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const db = getDatabase();
    const supabase = db.getClient();

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error deserializing user:", error);
      return done(error, null);
    }

    done(null, user);
  } catch (error) {
    console.error("Deserialize user error:", error);
    done(error, null);
  }
});

export default passport;
