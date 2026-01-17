// src/components/auth/AuthTabs.tsx
import { Tabs, Tab, Box } from '@mui/material';

type Props = {
  activeTab: 'login' | 'register';
  onChange: (tab: 'login' | 'register') => void;
};

export default function AuthTabs({ activeTab, onChange }: Props) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
      <Tabs
        value={activeTab}
        onChange={(_, v) => onChange(v)}
        variant="fullWidth"
        textColor="inherit"
        indicatorColor="primary"
      >
        <Tab label="Entrar" value="login" />
        <Tab label="Criar conta" value="register" />
      </Tabs>
    </Box>
  );
}