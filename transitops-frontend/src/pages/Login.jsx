import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 pb-8 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome to <span className="text-brand-600">TransitOps</span>
          </CardTitle>
          <p className="text-sm text-slate-500">
            Enter your credentials to access your fleet dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-slate-700">Email</label>
              <input
                type="email"
                className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none text-slate-700">Password</label>
                <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-500">Forgot password?</a>
              </div>
              <input
                type="password"
                className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
            </div>
            <Button type="submit" className="w-full mt-4">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
