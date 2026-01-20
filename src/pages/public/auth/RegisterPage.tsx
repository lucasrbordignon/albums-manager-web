import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AlertCircle, CheckCircle2, Eye, EyeOff, ImageUpIcon } from 'lucide-react'
import { register as registerApi } from '../../../services/auth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useNavigate } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'

type RegisterFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/auth/albums', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const form = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  })

  const onSubmit = async (data: RegisterFormData) => {
    setError(null)
    setSuccess(false)
    try {
      await registerApi(data)
      setSuccess(true)
      form.reset()
    } catch (err: any) {
      setError(err.response.data.message || 'Erro ao registrar')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white dark:bg-card rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center gap-4 mb-10">
          <ImageUpIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold text-shadow-2xs">Meus álbuns de fotos</h1>
        </div>

        <h1 className="text-xl font-semibold mb-4">Crie sua conta</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="on">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" autoComplete="name" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="exemplo@email.com"
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
              rules={{
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'A senha deve ter pelo menos 6 caracteres',
                },
                maxLength: {
                  value: 20,
                  message: 'A senha deve ter no máximo 20 caracteres',
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        className="pr-10"
                        autoComplete="new-password"
                        placeholder="*********"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                required: 'Confirmação de senha é obrigatória',
                validate: (value) =>
                  value === form.getValues('password') || 'As senhas não coincidem',
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="pr-10"
                        autoComplete="new-password"
                        placeholder="*********"
                        required
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-2" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Criando...' : 'Criar conta'}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Ao continuar, você concorda com nossos Termos e Política de Privacidade.
            </p>
            <Button
              type="button"
              onClick={() => navigate('/')}
              variant={'outline'}
              className="w-full mt-2"
            >
              Entre
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
                <AlertDescription>Conta criada com sucesso!</AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
      </div>
    </div>
  )
}
