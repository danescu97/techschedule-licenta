import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useAuthStore from '../../store/authStore';

const loginSchema = z.object({
  email: z.string().email({ message: 'Adresa de email invalidă' }),
  password: z.string().min(1, { message: 'Parola este obligatorie' }),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error: authError, isLoading } = useAuthStore();
  const [successMsg, setSuccessMsg] = useState('');
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const success = await login(data.email, data.password);
    if (success) {
      setSuccessMsg('Autentificare reușită! Te redirecționăm...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        {successMsg ? (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Succes!</h2>
            <p className="text-gray-600">{successMsg}</p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Intră în cont
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                sau{' '}
                <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
                  creează un cont nou
                </Link>
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm text-center">
              {authError}
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresă de email</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm mt-1"
                placeholder="exemplu@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Parolă</label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm mt-1"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isLoading ? 'Se procesează...' : 'Autentificare'}
            </button>
          </div>
        </form>
        </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
