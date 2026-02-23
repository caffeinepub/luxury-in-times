import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const ADMIN_PASSWORD = 'GRANTH';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminAuth', 'true');
      navigate({ to: '/admin' });
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-luxury-charcoal px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-luxury-black/50 p-8">
        <h1 className="mb-6 text-center font-serif text-3xl font-bold text-luxury-white">
          Admin Access
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="password" className="text-luxury-white">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="mt-2 border-luxury-gold/30 bg-luxury-black text-luxury-white"
              placeholder="Enter admin password"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full bg-luxury-gold font-serif font-semibold text-luxury-black hover:bg-luxury-champagne"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
