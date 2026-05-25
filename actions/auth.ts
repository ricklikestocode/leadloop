"use server"

import { signIn, signOut } from "@/lib/auth"
import { loginSchema, signupSchema } from "@/lib/validation"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"

export async function login(values: any, callbackUrl: string = "/dashboard") {
  const validatedFields = loginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }

    throw error
  }
}

export async function signup(values: any, callbackUrl: string = "/dashboard") {
  const validatedFields = signupSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { email, password, name } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await db.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "Email already in use!" }
  }

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  // Create default workspace for user
  await db.workspace.create({
    data: {
      name: `${name}'s Workspace`,
      users: {
        create: {
          userId: user.id,
          role: "ADMIN",
        },
      },
    },
  })

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Something went wrong!" }
    }

    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: "/sign-in" })
}
