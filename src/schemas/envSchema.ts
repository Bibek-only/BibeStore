import { z } from "zod";
const envSchema = z.object({
  DATABASE_URL_DEV: z.string().nonempty("Data base url is empty"),
  DATABASE_URL_PROD: z.string().nonempty("Data base url is empty"),
  NEXT_AUTH_URL_DEV: z.string().nonempty("Next auth url is empty"),
  NEXT_AUTH_URL_PROD: z.string().nonempty("Next auth url is empty"),
  NEXTAUTH_SECRET: z.string().nonempty("NextAuth secreate is empty"),
  GOOGLE_CLIENT_ID: z.string().nonempty("Google client id is empty"),
  GOOGLE_CLIENT_SECRET: z.string().nonempty("Googe client secreate is empty"),
  IMAGE_KIT_PUBLIC_KEY: z.string().nonempty("imagekit public key is empyt"),
  IMAGE_KIT_PRIVATE_KEY: z.string().nonempty("image kit private key is empty"),
  IMAGE_KIT_URLENDPOINT: z.string().nonempty("image kit urlendpoint is empty"),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
});

const validateEnvSchema = envSchema.safeParse(process.env);

if (!validateEnvSchema.success) {
  console.log(
    "Some error in the envirionment variable",
    validateEnvSchema.error.format()
  );
  process.exit(1);
}

export const varible = validateEnvSchema.data;
