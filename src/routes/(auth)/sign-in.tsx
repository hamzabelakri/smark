import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignIn } from '@/apps/auth'
import { useAuthStore } from '@/stores/auth-store'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in')({
  beforeLoad: ({ search }) => {
    const token = useAuthStore.getState().token

    if (token) {
      throw redirect({ to: search.redirect || '/' })
    }
  },
  component: SignIn,
  validateSearch: searchSchema,
})