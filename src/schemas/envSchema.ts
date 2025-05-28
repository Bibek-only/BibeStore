import {z} from "zod"
const envSchema = z.object({
DATABASE_URL_DEV: z.string().nonempty("Data base url is empty"),
NEXT_AUTH_URL_DEV:z.string().nonempty("Next auth url is empty"),
NEXTAUTH_SECRET:z.string().nonempty("NextAuth secreate is empty"),
GOOGLE_CLIENT_ID_DEV:z.string().nonempty("Google client id is empty"),
GOOGLE_CLIENT_SECRET_DEV:z.string().nonempty("Googe client secreate is empty"),

})

const validateEnvSchema = envSchema.safeParse(process.env);

if(!validateEnvSchema.success){
    console.log("Some error in the envirionment variable",validateEnvSchema.error.format())
    process.exit(1);
}

export {validateEnvSchema}