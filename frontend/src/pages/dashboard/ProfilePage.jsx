import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { User, Phone, MapPin, Mail, Camera, Save } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../api/axios';

const ProfilePage = () => {
  const { user, checkAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || '',
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      // Typically you'd have an endpoint like PUT /auth/profile/
      // Here we assume standard structure, adjust if needed
      await api.patch(`/auth/profile/`, data);
    },
    onSuccess: () => {
      setSuccessMessage('Profil actualizat cu succes!');
      checkAuth(); // refresh user store
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  });

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profilul Meu</h1>
        <p className="mt-2 text-gray-600">Gestionează datele personale și detaliile contului.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
              {user?.profile_photo ? (
                <img src={user.profile_photo} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-colors shadow-sm">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">{user?.first_name} {user?.last_name}</h2>
            <p className="text-gray-500 font-medium">{user?.role?.toUpperCase()}</p>
            <div className="flex items-center gap-4 mt-2 justify-center md:justify-start">
              <span className="flex items-center gap-1.5 text-sm text-gray-600"><Mail className="w-4 h-4" /> {user?.email}</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm font-medium">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nume</label>
                <input 
                  type="text"
                  {...register('last_name', { required: 'Numele este obligatoriu' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prenume</label>
                <input 
                  type="text"
                  {...register('first_name', { required: 'Prenumele este obligatoriu' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">Email-ul nu poate fi modificat.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text"
                    {...register('phone')}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="07XX XXX XXX"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                {updateProfileMutation.isPending ? 'Se salvează...' : 'Salvează Modificările'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
