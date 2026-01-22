import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Eye, EyeOff, ImageUpIcon } from 'lucide-react'

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type LoginFormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/auth/albums', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    setSuccess(false)
    try {
      const userData = await loginApi(data)
      login(userData.data)
      setSuccess(true)
      navigate('/auth/albums', { replace: true })
    } catch (err: any) {
      setError(err.response.data.message || 'Erro ao fazer login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white dark:bg-card rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center gap-4 mb-10">
          <ImageUpIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold text-shadow-2xs">Meus álbuns de fotos</h1>
        </div>

        <h1 className="text-xl font-semibold mb-4">Bem-vindo de volta!</h1>

        <h1 className="text-xl font-semibold mb-4">Faça login na sua conta</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="on">
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
                      required
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
                        placeholder="**********"
                        required
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full m-0" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300" />
              <span className="mx-4 text-gray-500 select-none">ou</span>
              <div className="flex-1 border-t border-gray-300" />
            </div>

            <Button
              type="button"
              onClick={() => navigate('/register')}
              variant={'outline'}
              className="w-full"
            >
              Cadastre-se
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 text-green-600">
                <CheckCircle2 className="h-4 w-4 stroke-green-600" />
                <AlertTitle>Sucesso</AlertTitle>
                <AlertDescription>Login realizado! Redirecionando...</AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
      </div>
    </div>
  )
}
