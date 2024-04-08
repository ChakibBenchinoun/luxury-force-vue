import { eq } from 'drizzle-orm'
import * as v from 'valibot'
import { Scrypt } from 'lucia'

import { user } from '@/server/db/schema'

export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia
  const db = event.context.db

  const formData = await readFormData(event)
  const email = formData.get('email')
  const password = formData.get('password')

  const emailSchema = v.string([v.minLength(3), v.maxLength(31), v.email()])
  const passwordSchema = v.string([v.minLength(3), v.maxLength(255)])
  const validationPromises = [
    v.safeParse(emailSchema, email),
    v.safeParse(passwordSchema, password),
  ];


  const [emailResult, passwordResult] = await Promise.all(validationPromises);

  if (!emailResult.success) {
    throw createError({
      statusMessage: 'Invalid email',
      statusCode: 400,
    })
  }

  if (!passwordResult.success) {
    throw createError({
      statusMessage: 'Invalid password',
      statusCode: 400,
    })
  }


  const existingUser = await db
  .select()
  .from(user)
  .where(eq(user.email, emailResult.output))
  .get()

  if (!existingUser) {
    throw createError({
      status: 400,
      statusMessage: 'User does not exists, Try again',
    })
  }

  const validPassword = await new Scrypt().verify(existingUser.hashedPassword, passwordResult.output)

  if (!validPassword) {
    throw createError({
      status: 400,
      statusMessage: 'Invalid Password',
    })
  }

  const session = await lucia.createSession(existingUser.id, {})
  appendHeader(
    event,
    'Set-Cookie',
    lucia.createSessionCookie(session.id).serialize(),
  )

  // NOTE: It's recommended to setup a cron-job to delete expired sessions
  await lucia.deleteExpiredSessions()
})
