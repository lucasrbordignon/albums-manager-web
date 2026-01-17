import { Link, TextField, Button, Snackbar, Alert } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import PasswordField from "./PasswordField";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../../../services/auth";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<LoginFormData>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setSuccess(false);
    try {
      const userData = await loginApi(data);
      login(userData); // salva usuário no contexto
      setSuccess(true);
      navigate("/private/albums", { replace: true }); // redireciona para Albums
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao fazer login");
      } else {
        setError("Erro ao fazer login");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={useFormContext().control}
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

      <PasswordField name="password" />

      <div className="flex justify-between items-center mt-2 text-sm">
        <Link href="#" underline="hover" color="primary">
          Esqueceu a senha?
        </Link>
      </div>

      <Button
        type="submit"
        loading={isSubmitting}
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        sx={{ mt: 3, py: 1.5 }}
      >
        Entrar
      </Button>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Login realizado com sucesso!
        </Alert>
      </Snackbar>
    </form>
  );
}
