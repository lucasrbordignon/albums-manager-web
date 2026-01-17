import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'

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

  const { login } = useAuth()
  const navigate = useNavigate()

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

      navigate('/private/albums', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="seu@email.com" type="email" autoComplete="email" {...field} />
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
                      {...field}
                      autoComplete="current-password"
                      placeholder="**********"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Entrando...' : 'Entre'}
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
  )
}
