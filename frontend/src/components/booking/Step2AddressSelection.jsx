import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, ArrowLeft, MapPin, Plus } from 'lucide-react';
import api from '../../api/axios';
import useBookingStore from '../../store/bookingStore';

const addressSchema = z.object({
  label: z.string().min(2, 'Eticheta este obligatorie (ex: Acasă)'),
  street: z.string().min(5, 'Adresa completă este obligatorie'),
  city: z.string().min(2, 'Orașul este obligatoriu'),
  county: z.string().min(2, 'Județul este obligatoriu'),
  zip_code: z.string().optional(),
});

const Step2AddressSelection = () => {
  const { setAddress, nextStep, prevStep, selectedAddressId } = useBookingStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const queryClient = useQueryClient();

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await api.get('/auth/addresses/');
      return response.data;
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
  });

  const addAddressMutation = useMutation({
    mutationFn: async (newAddress) => {
      // Ensure zip_code is sent as empty string if missing, to prevent backend errors
      const payload = { ...newAddress, zip_code: newAddress.zip_code || '' };
      const response = await api.post('/auth/addresses/', payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setAddress(data.id);
      setShowAddForm(false);
      reset();
      setErrorMsg('');
    },
    onError: (error) => {
      const serverErr = error.response?.data;
      if (serverErr && typeof serverErr === 'object') {
        setErrorMsg(Object.values(serverErr).join(' '));
      } else {
        setErrorMsg('A apărut o eroare la salvarea adresei. Te rugăm să încerci din nou.');
      }
    }
  });

  const onSubmit = (data) => {
    setErrorMsg('');
    addAddressMutation.mutate({ ...data, is_default: false });
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Unde are loc intervenția?</h2>
      
      {!showAddForm ? (
        <div className="space-y-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {isLoading ? (
            <div className="space-y-3">
              {[1,2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>)}
            </div>
          ) : addresses?.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">Nu ai nicio adresă salvată.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-primary font-medium hover:text-primary-dark"
              >
                Adaugă o adresă nouă
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses?.map((address) => (
                <button
                  key={address.id}
                  onClick={() => setAddress(address.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-all flex items-start gap-3 ${
                    selectedAddressId === address.id
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                      : 'border-gray-200 hover:border-primary/50 bg-white'
                  }`}
                >
                  <MapPin className={`w-6 h-6 flex-shrink-0 mt-0.5 ${selectedAddressId === address.id ? 'text-primary' : 'text-gray-400'}`} />
                  <div>
                    <h4 className="font-bold text-gray-900">{address.label}</h4>
                    <p className="text-sm text-gray-600 mt-1">{address.street}</p>
                    <p className="text-sm text-gray-500">{address.city}, {address.county}</p>
                  </div>
                </button>
              ))}
              
              <button
                onClick={() => setShowAddForm(true)}
                className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-gray-50 transition-colors text-gray-500 hover:text-primary min-h-[100px]"
              >
                <Plus className="w-6 h-6 mb-2" />
                <span className="font-medium text-sm">Adaugă o adresă nouă</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">Adresă nouă</h3>
            {addresses?.length > 0 && (
              <button type="button" onClick={() => setShowAddForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Anulează</button>
            )}
          </div>
          
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm mb-4">
              {errorMsg}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Etichetă (ex: Acasă, Birou)</label>
              <input type="text" {...register('label')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label.message}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresă (Stradă, număr, apartament)</label>
              <input type="text" {...register('street')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Județ</label>
              <input type="text" {...register('county')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              {errors.county && <p className="text-red-500 text-xs mt-1">{errors.county.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Oraș / Sector</label>
              <input type="text" {...register('city')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button type="submit" disabled={addAddressMutation.isPending} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50">
              {addAddressMutation.isPending ? 'Se salvează...' : 'Salvează și folosește'}
            </button>
          </div>
        </form>
      )}

      <div className="flex justify-between pt-6 border-t border-gray-100">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-3 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Înapoi
        </button>
        <button
          onClick={nextStep}
          disabled={!selectedAddressId || showAddForm}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pasul următor
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Step2AddressSelection;
