import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface HealthStatus {
  status: 'ok' | 'down' | string;
  timestamp: string;
  uptime: number;
}

interface HealthCheckContextType {
  health: HealthStatus | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const HealthCheckContext = createContext<HealthCheckContextType | undefined>(undefined);

export const useHealthCheck = () => {
  const ctx = useContext(HealthCheckContext);
  if (!ctx) throw new Error('useHealthCheck must be used within a HealthCheckProvider');
  return ctx;
};

export const HealthCheckProvider = ({ children }: { children: ReactNode }) => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3333/health');
      if (!res.ok) throw new Error('Erro ao consultar health');
      const data = await res.json();
      setHealth(data);
    } catch (e: any) {
      setError(e.message || 'Erro desconhecido');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <HealthCheckContext.Provider value={{ health, loading, error, refresh: fetchHealth }}>
      {children}
    </HealthCheckContext.Provider>
  );
};
