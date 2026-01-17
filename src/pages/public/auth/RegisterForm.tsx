import { Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import PasswordField from './PasswordField';
import { useState } from 'react';
import { register as registerApi } from '../../../services/auth';

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const { handleSubmit, formState: { isSubmitting } } = useFormContext<RegisterFormData>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setSuccess(false);
    try {
      await registerApi(data);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Erro ao registrar');
      } else {
        setError('Erro ao registrar');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={useFormContext<RegisterFormData>().control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Nome completo"
            fullWidth
            margin="normal"
            variant="standard"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={useFormContext<RegisterFormData>().control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="E-mail"
            fullWidth
            variant="standard"
            autoComplete="email"
            margin="normal"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <PasswordField name="password" label="Senha" autoComplete="new-password" />
      <PasswordField name="confirmPassword" label="Confirmar senha" autoComplete="new-password" />

      <Button
        type="submit"
        disabled={isSubmitting}
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        sx={{ mt: 3, py: 1.5 }}
      >
        Criar conta
      </Button>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
        Ao continuar, você concorda com nossos Termos e Política de Privacidade.
      </Typography>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
      <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)}>
        <Alert severity="success" onClose={() => setSuccess(false)}>Conta criada com sucesso!</Alert>
      </Snackbar>
    </form>
  );
}