import { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
  name: string;
  label?: string;
  autoComplete?: string;
};

export default function PasswordField({ name, label = 'Senha', autoComplete = 'current-password' }: Props) {
  const [show, setShow] = useState(false);
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type={show ? 'text' : 'password'}
          label={label}
          fullWidth
          variant="standard"
          margin="normal"
          autoComplete={autoComplete}
          error={!!error}
          helperText={error?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShow(!show)}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}