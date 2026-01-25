import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler, type SubmitErrorHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ImageUpIcon } from 'lucide-react'
import * as z from 'zod'

import { useAuth } from '../../../contexts/AuthContext'
import { login as loginApi } from '../../../services/auth'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z
    .email({ message: 'Formato de e-mail inválido' })
    .min(1, { message: 'E-mail é obrigatório' }),

  password: z
    .string()
    .min(1, { message: 'Senha é obrigatória' })
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/auth/albums', { replace: true })
    }
  }, [isAuthenticated, navigate])
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  })

  const onSubmit: SubmitHandler<LoginFormData> = data => {
    form.clearErrors('root')

    loginApi(data)
      .then(payload => {
        login({
          user: payload.data.user,
          accessToken: payload.data.accessToken,
          refreshToken: payload.data.refreshToken,
        })

        toast.success('Login realizado com sucesso!')
        navigate('/auth/albums', { replace: true })
      })
      .catch(err => {
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Erro ao fazer login. Verifique suas credenciais.'

        toast.error(message)
      })
  }

  const onError: SubmitErrorHandler<LoginFormData> = () => {
    toast.error('Por favor, corrija os erros no formulário antes de continuar.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-white dark:bg-card rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center gap-4 mb-10">
          <ImageUpIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold">Meus álbuns de fotos</h1>
        </div>

        <h1 className="text-xl font-semibold mb-6 text-center">Faça login na sua conta</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-5" noValidate>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="seu@email.com"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        className="pr-10"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(prev => !prev)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="flex items-center my-5">
              <div className="flex-1 border-t border-gray-300 dark:border-gray-700" />
              <span className="mx-4 text-sm text-muted-foreground select-none">ou</span>
              <div className="flex-1 border-t border-gray-300 dark:border-gray-700" />
            </div>

            <Button
              type="button"
              onClick={() => navigate('/register')}
              variant="outline"
              className="w-full"
            >
              Cadastre-se
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
