import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import { authConfig } from "@/utils/authConfig";

export const authOptions: NextAuthOptions = authConfig

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
