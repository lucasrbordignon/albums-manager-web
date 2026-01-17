import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'
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

  const form = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setError(null)
    setSuccess(false)
    try {
      await registerApi(data)
      setSuccess(true)
      form.reset()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
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
                  <Input placeholder="exemplo@email.com" type="email" {...field} />
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
                      autoComplete="new-password"
                      placeholder="*********"
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar senha</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="pr-10"
                      {...field}
                      autoComplete="new-password"
                      placeholder="*********"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300" />
            <span className="mx-4 text-gray-500 select-none">ou</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <Button
            type="button"
            onClick={() => navigate('/login')}
            variant={'outline'}
            className="w-full"
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
  )
}
