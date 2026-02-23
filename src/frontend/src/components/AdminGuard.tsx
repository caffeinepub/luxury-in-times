import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated) {
      navigate({ to: '/admin/login' });
    }
  }, [navigate]);

  const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
