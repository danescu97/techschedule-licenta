import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';

const reportSchema = z.object({
  diagnosis: z.string().min(5, 'Te rugăm să descrii problema găsită (minim 5 caractere)'),
  work_done: z.string().min(5, 'Te rugăm să detaliezi lucrările efectuate'),
  parts_replaced: z.string().optional(),
  final_price: z.string().min(1, 'Introdu prețul final facturat'),
  is_resolved: z.boolean().default(true),
  follow_up_needed: z.boolean().default(false),
  follow_up_notes: z.string().optional(),
});

const InterventionReportForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [photo, setPhoto] = useState(null);

  const { data: apt, isLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      const response = await api.get(`/appointments/appointments/${id}/`);
      return response.data;
    }
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      is_resolved: true,
      follow_up_needed: false,
    }
  });

  const followUpNeeded = watch('follow_up_needed');

  const submitReportMutation = useMutation({
    mutationFn: async (formData) => {
      // 1. Mark as completed and update final price
      await api.post(`/appointments/appointments/${id}/change_status/`, { 
        status: 'completed',
        note: `Preț final: ${formData.final_price} RON`
      });

      // 2. Submit the report details (assuming backend endpoint /appointments/reports/)
      // For now, we will just simulate it as we don't have a specific report endpoint yet
      // If we did, it would be:
      // await api.post('/appointments/reports/', { ...formData, appointment: id, technician: user.technician_profile.id });
      
      // We will pretend it succeeds
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments_tech'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', id] });
      navigate('/dashboard', { state: { reportSuccess: true } });
    }
  });

  const onSubmit = (data) => {
    submitReportMutation.mutate(data);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Se încarcă detaliile...</div>;
  if (!apt) return <div className="min-h-screen flex items-center justify-center text-red-500">Programarea nu a fost găsită.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Înapoi la dashboard
      </Link>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Raport de Finalizare</h1>
            <p className="text-gray-500 text-sm">Programarea #{apt.id} • Client: {apt.client_detail?.first_name} {apt.client_detail?.last_name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Diagnoză (Ce problemă ai identificat?)</label>
            <textarea 
              {...register('diagnosis')}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary resize-none"
              placeholder="Ex: Rezistența mașinii de spălat a fost arsă din cauza depunerilor de calcar."
            />
            {errors.diagnosis && <p className="text-red-500 text-xs mt-1">{errors.diagnosis.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Lucrări efectuate</label>
            <textarea 
              {...register('work_done')}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary resize-none"
              placeholder="Ex: Demontare rezistență veche, curățare cuvă, montare rezistență nouă, testare în gol."
            />
            {errors.work_done && <p className="text-red-500 text-xs mt-1">{errors.work_done.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Piese înlocuite (opțional)</label>
            <input 
              type="text"
              {...register('parts_replaced')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="Ex: Rezistență încălzire 2000W Bosch"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cost Total Intervenție (RON)</label>
              <div className="relative">
                <input 
                  type="number"
                  step="0.01"
                  {...register('final_price')}
                  className="w-full p-3 pr-16 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  placeholder={apt.estimated_price}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">RON</span>
                </div>
              </div>
              {errors.final_price && <p className="text-red-500 text-xs mt-1">{errors.final_price.message}</p>}
            </div>

            <div className="space-y-4 pt-4 border-t md:border-t-0 md:border-l md:pl-6 border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  {...register('is_resolved')}
                  className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className="text-gray-700 font-medium">Problema a fost rezolvată complet</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  {...register('follow_up_needed')}
                  className="w-5 h-5 text-yellow-500 rounded border-gray-300 focus:ring-yellow-500"
                />
                <span className="text-gray-700 font-medium">Este necesară o vizită suplimentară</span>
              </label>
            </div>
          </div>

          {followUpNeeded && (
            <div className="animate-in fade-in slide-in-from-top-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <label className="block text-sm font-semibold text-yellow-800 mb-1">Detalii vizită suplimentară</label>
              <textarea 
                {...register('follow_up_notes')}
                rows={2}
                className="w-full p-3 border border-yellow-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 bg-white"
                placeholder="Ex: Trebuie comandată piesa XYZ. Revin vineri."
              />
            </div>
          )}

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={submitReportMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {submitReportMutation.isPending ? 'Se salvează...' : 'Finalizează Intervenția'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterventionReportForm;
