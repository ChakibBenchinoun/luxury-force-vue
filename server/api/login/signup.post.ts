import { Scrypt } from 'lucia'
import * as v from 'valibot'

import { user } from '@/server/db/schema'

export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia
  const db = event.context.db
  const formData = await readFormData(event)
  const email = formData.get('email')
  const password = formData.get('password')

  const emailSchema = v.string([v.minLength(3), v.maxLength(31), v.email()])
  const emailResult = v.safeParse(emailSchema, email)

  if (!emailResult.success) {
    throw createError({
      message: 'Invalid email',
      statusCode: 400,
    })
  }

  const passwordSchema = v.string([v.minLength(3), v.maxLength(255)])
  const passwordResult = v.safeParse(passwordSchema, password)

  if (!passwordResult.success) {
    throw createError({
      message: 'Invalid password',
      statusCode: 400,
    })
  }

  const hashedPassword = await new Scrypt().hash(passwordResult.output)

  try {
    const response = await db.insert(user).values({
      email: emailResult.output,
      hashedPassword,
    }).returning({ id: user.id, email: user.email })
    const newUser = response.at(0)
    if (!newUser) {
      throw createError({
        status: 400,
        statusMessage: 'Invalid username or password',
      })
    }
    const session = await lucia.createSession(newUser.id, {})
    appendHeader(
      event,
      'Set-Cookie',
      lucia.createSessionCookie(session.id).serialize(),
    )
  }
  catch {
    throw createError({
      status: 400,
      statusMessage: 'Email already exists',
    })
  }
})
