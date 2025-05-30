import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { varible } from "@/schemas/envSchema";
import prisma from "@/db/db";
import bcrypt from "bcryptjs";

export const authConfig = {
  providers: [
    //google auth provider
    GoogleProvider({
      clientId: varible.GOOGLE_CLIENT_ID,
      clientSecret: varible.GOOGLE_CLIENT_SECRET,
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
        //check email is presen in db or not
        const userRes = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (userRes) {
          //compare the password is corect or not
          const passRes = await bcrypt.compare(
            credentials.password,
            userRes.password as string
          );
          if (passRes) {
            return {
              id: userRes.id,
              userId: userRes.id,
              email: userRes.email,
              name: userRes.name,
            };
          }
        }

        return null;
      },
    }),
  ],
  secret: varible.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }: any) {
      if (account?.provider === "google") {
        try {
          //check is email is exist or not
          const emailRes = await prisma.user.findUnique({
            where: {
              email: token.email,
            },
          });

          // create the user if the user is not exist
          if (!emailRes) {
            const userRes = await prisma.user.create({
              data: {
                email: token.email as string,
                name: token.name as string,
                profileImageUrl: token.picture as string,
                password: "google",
                isEmailVerifyed: true,
              },
            });
            //create token and return
            token.userId = userRes.id;
            return token;
          } else {
            token.userId = emailRes.id;
            return token;
          }
        } catch (error) {
          console.log("error in catch of user db operation", error);
        }
      }
      token.userId = token.sub;
      return token;
    },
    async session({ session, user, token }: any) {
      session.user.userId = token.sub;

      return session;
    },
  },
};
