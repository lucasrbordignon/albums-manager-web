import { useState } from 'react';
import { Box, Container, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AuthTabs from './AuthTabs';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import AuthImageSide from './AuthImageSide';

const loginSchema = z.object({
  email: z.email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const methods = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(activeTab === 'login' ? loginSchema : registerSchema),
    mode: 'onTouched',
    defaultValues:
      activeTab === 'login'
        ? { email: '', password: '' }
        : { name: '', email: '', password: '', confirmPassword: '' },
  });

  const handleTabChange = (newTab: 'login' | 'register') => {
    setActiveTab(newTab);
    methods.reset(
      newTab === 'login'
        ? { email: '', password: '' }
        : { name: '', email: '', password: '', confirmPassword: '' }
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          py: { xs: 6, md: 0 },
          px: { xs: 3, md: 6, lg: 10 },
        }}
      >
        <Paper
          elevation={isMobile ? 0 : 8}
          sx={{
            p: { xs: 4, sm: 6 },
            width: '100%',
            borderRadius: 3,
            bgcolor: 'background.paper',
            maxWidth: 480,
            mx: 'auto',
          }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            {activeTab === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </Typography>

          <AuthTabs activeTab={activeTab} onChange={handleTabChange} />

          <FormProvider {...methods}>
            {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
          </FormProvider>
        </Paper>
      </Container>

      {!isMobile && <AuthImageSide />}
    </Box>
  );
}