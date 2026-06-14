import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useAuthStore from '../../store/authStore';

const registerSchema = z.object({
  username: z.string().min(3, { message: 'Username trebuie să aibă minim 3 caractere' }),
  email: z.string().email({ message: 'Adresa de email invalidă' }),
  password: z.string().min(8, { message: 'Parola trebuie să aibă minim 8 caractere' }),
  password_confirm: z.string(),
  first_name: z.string().min(2, { message: 'Prenumele este obligatoriu' }),
  last_name: z.string().min(2, { message: 'Numele este obligatoriu' }),
  phone: z.string().min(10, { message: 'Numărul de telefon este invalid' }),
}).refine((data) => data.password === data.password_confirm, {
  message: "Parolele nu se potrivesc",
  path: ["password_confirm"],
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, error: authError, isLoading } = useAuthStore();
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    const success = await registerUser(data);
    if (success) {
      setSuccessMsg('Cont creat cu succes! Te redirecționăm către login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cont creat cu succes!</h2>
            <p className="text-gray-600">{successMsg}</p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Creează un cont
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                sau{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                  intră în contul tău
                </Link>
              </p>
            </div>
            
            <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm text-center">
                  {typeof authError === 'object' ? JSON.stringify(authError) : authError}
                </div>
              )}

          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nume</label>
              <input
                type="text"
                {...register('last_name')}
                className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prenume</label>
              <input
                type="text"
                {...register('first_name')}
                className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              {...register('username')}
              className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Telefon</label>
            <input
              type="text"
              {...register('phone')}
              className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Parolă</label>
              <input
                type="password"
                {...register('password')}
                className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmă Parola</label>
              <input
                type="password"
                {...register('password_confirm')}
                className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              {errors.password_confirm && <p className="text-red-500 text-xs mt-1">{errors.password_confirm.message}</p>}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || successMsg}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isLoading ? 'Se procesează...' : 'Creează cont'}
            </button>
          </div>
        </form>
        </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
