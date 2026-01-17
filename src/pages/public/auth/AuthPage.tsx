import { useState } from "react";
import { Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import AuthTabs from "./AuthTabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import AuthImageSide from "./AuthImageSide";
import logo from "@/assets/logo.svg";
import { ThemeToggle } from "@/components/ThemeToggle";

const loginSchema = z.object({
  email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const methods = useForm<LoginFormData | RegisterFormData>({
    resolver: zodResolver(activeTab === "login" ? loginSchema : registerSchema),
    mode: "onTouched",
    defaultValues:
      activeTab === "login"
        ? { email: "", password: "" }
        : { name: "", email: "", password: "", confirmPassword: "" },
  });

  const handleTabChange = (newTab: "login" | "register") => {
    setActiveTab(newTab);
    methods.reset(
      newTab === "login"
        ? { email: "", password: "" }
        : { name: "", email: "", password: "", confirmPassword: "" },
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <ThemeToggle />
      <div className="flex flex-col flex-1 items-center justify-center p-6 md:p-12 lg:p-20">
        <div className="w-full max-w-[480px] mb-8 flex flex-col items-center">
          <img
            src={logo}
            alt="Logo"
            className="w-16 h-16 mb-4 object-contain"
          />
          <h1 className="text-2xl font-bold text-color-primary tracking-tight">
            Photo Album Manager
          </h1>
        </div>

        <Paper
          elevation={isMobile ? 0 : 3}
          className="w-full max-w-[480px] p-8 md:p-10 rounded-2xl"
          sx={{ bgcolor: "background.paper" }}
        >
          <Typography
            variant="h5"
            component="h2"
            align="center"
            fontWeight="600"
            gutterBottom
          >
            {activeTab === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
          </Typography>

          <div className="mt-6">
            <AuthTabs activeTab={activeTab} onChange={handleTabChange} />
          </div>

          <div className="mt-8">
            <FormProvider {...methods}>
              {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
            </FormProvider>
          </div>
        </Paper>
      </div>

      {!isMobile && (
        <div className="hidden md:block md:w-1/2 lg:w-3/5">
          <AuthImageSide />
        </div>
      )}
    </div>
  );
}
