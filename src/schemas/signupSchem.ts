import {z} from "zod"
const signupSchema = z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required").email("Enter an valid email"),
    password: z.string().nonempty("Password is required").min(6,"Password is too sort")
})

export type signupType = z.infer<typeof signupSchema>;
export {signupSchema}
