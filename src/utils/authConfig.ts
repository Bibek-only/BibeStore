import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { validateEnvSchema } from "@/schemas/envSchema";

export const authConfig = {
  providers: [
    //google auth provider
    GoogleProvider({
      clientId: validateEnvSchema.data?.GOOGLE_CLIENT_ID_DEV!,
      clientSecret: validateEnvSchema.data?.GOOGLE_CLIENT_SECRET_DEV!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials: any, req: any) {
        //perform authentication logic here

        //    return if user is authenticated and if not then return null
        return {
          id: "user-1",
          email: credentials?.email,
        };
        // return null;
      },
    }),
  ],
  secret: validateEnvSchema.data?.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user, token }: any) {
      console.log("sesstion->", session, "user->", user, "token->", token);
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }: any) {
      return token;
    },
  },
};
