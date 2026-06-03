import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { ArrowLeft, MapPin, Clock, Calendar, User as UserIcon, CheckCircle2, Clock3, Wrench, XCircle } from 'lucide-react';
import api from '../../api/axios';

const AppointmentDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      await api.post('/reviews/reviews/', reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment', id] });
    }
  });

  const { data: apt, isLoading, isError } = useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      const response = await api.get(`/appointments/appointments/${id}/`);
      return response.data;
    }
  });

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'În așteptare';
      case 'confirmed': return 'Confirmat';
      case 'in_progress': return 'În lucru';
      case 'completed': return 'Finalizat';
      case 'cancelled': return 'Anulat';
      case 'failed': return 'Nerealizat';
      default: return status;
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Se încarcă detaliile...</div>;
  if (isError || !apt) return <div className="min-h-screen flex items-center justify-center text-red-500">Eroare la încărcarea programării.</div>;

  const isCompleted = apt.status === 'completed';
  const isCancelled = ['cancelled', 'failed'].includes(apt.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Înapoi la dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programare #{apt.id}</h1>
          <p className="text-gray-500">Creată la {format(new Date(apt.created_at), 'dd MMM yyyy HH:mm', { locale: ro })}</p>
        </div>
        <div>
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border inline-flex items-center gap-2
            ${isCompleted ? 'bg-green-100 text-green-800 border-green-200' : 
              isCancelled ? 'bg-red-100 text-red-800 border-red-200' : 
              'bg-blue-100 text-blue-800 border-blue-200'}`}
          >
            {isCompleted && <CheckCircle2 className="w-4 h-4" />}
            {isCancelled && <XCircle className="w-4 h-4" />}
            {!isCompleted && !isCancelled && <Clock3 className="w-4 h-4" />}
            {getStatusText(apt.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Timeline (Left side on desktop) */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h3 className="font-bold text-gray-900 mb-6">Status Intervenție</h3>
          
          <div className="relative border-l border-gray-200 ml-3 space-y-6">
            <div className="relative pl-6">
              <span className={`absolute -left-2 top-1 w-4 h-4 rounded-full border-2 border-white ${apt.created_at ? 'bg-primary' : 'bg-gray-300'}`}></span>
              <p className="font-medium text-sm text-gray-900">Programare Creată</p>
              <p className="text-xs text-gray-500">{format(new Date(apt.created_at), 'dd MMM, HH:mm')}</p>
            </div>
            
            <div className="relative pl-6">
              <span className={`absolute -left-2 top-1 w-4 h-4 rounded-full border-2 border-white ${apt.confirmed_at ? 'bg-primary' : 'bg-gray-300'}`}></span>
              <p className={`font-medium text-sm ${apt.confirmed_at ? 'text-gray-900' : 'text-gray-400'}`}>Confirmată de tehnician</p>
              {apt.confirmed_at && <p className="text-xs text-gray-500">{format(new Date(apt.confirmed_at), 'dd MMM, HH:mm')}</p>}
            </div>

            <div className="relative pl-6">
              <span className={`absolute -left-2 top-1 w-4 h-4 rounded-full border-2 border-white ${apt.status === 'in_progress' || isCompleted ? 'bg-primary' : 'bg-gray-300'}`}></span>
              <p className={`font-medium text-sm ${apt.status === 'in_progress' || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>Tehnicianul e pe drum / lucrează</p>
            </div>

            <div className="relative pl-6">
              <span className={`absolute -left-2 top-1 w-4 h-4 rounded-full border-2 border-white ${isCompleted ? 'bg-green-500' : isCancelled ? 'bg-red-500' : 'bg-gray-300'}`}></span>
              <p className={`font-medium text-sm ${isCompleted ? 'text-green-600' : isCancelled ? 'text-red-600' : 'text-gray-400'}`}>
                {isCompleted ? 'Finalizat' : isCancelled ? 'Anulat / Eșuat' : 'Finalizare'}
              </p>
              {apt.completed_at && <p className="text-xs text-gray-500">{format(new Date(apt.completed_at), 'dd MMM, HH:mm')}</p>}
            </div>
          </div>
        </div>

        {/* Details (Right side on desktop) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Detalii Serviciu</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Wrench className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Serviciu solicitat</p>
                  <p className="font-medium text-gray-900">{apt.service_detail?.name}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Data și Ora</p>
                  <p className="font-medium text-gray-900">
                    {apt.scheduled_date ? format(new Date(apt.scheduled_date), 'EEEE, dd MMMM yyyy', { locale: ro }) : ''} <br/>
                    Ora: {apt.time_slot_start}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Locație</p>
                  <p className="font-medium text-gray-900">{apt.address_detail?.street}</p>
                  <p className="text-gray-600 text-sm">{apt.address_detail?.city}, {apt.address_detail?.county}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-1">Descrierea problemei:</p>
                <p className="text-gray-800 text-sm">{apt.problem_description || 'Nu au fost oferite detalii suplimentare.'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Tehnician Alocat</h3>
            {apt.technician_detail ? (
              <div className="flex items-center gap-4">
                {apt.technician_detail.user?.profile_photo ? (
                  <img src={apt.technician_detail.user.profile_photo} alt="Tehnician" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                    <UserIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-lg text-gray-900">{apt.technician_detail.user?.first_name} {apt.technician_detail.user?.last_name}</p>
                  <p className="text-sm text-gray-600">Telefon: {apt.technician_detail.user?.phone || 'Nedisponibil'}</p>
                  <p className="text-sm text-yellow-500 font-medium">★ {apt.technician_detail.rating?.toFixed(1) || '0.0'}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">Nu a fost alocat încă un tehnician.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-4">Sumar Plată</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Cost estimat manoperă</span>
              <span className="font-medium text-gray-900">{apt.estimated_price} RON</span>
            </div>
            {isCompleted && apt.final_price && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span className="font-bold text-gray-900">Total de Plată</span>
                <span className="font-bold text-xl text-green-600">{apt.final_price} RON</span>
              </div>
            )}
            {!isCompleted && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                Costul final va fi calculat după terminarea intervenției.
              </div>
            )}
          </div>
          
          {apt.status === 'pending' && (
            <div className="flex justify-end mt-4">
              <button className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors px-4 py-2 hover:bg-red-50 rounded-lg">
                Anulează programarea
              </button>
            </div>
          )}

          {isCompleted && !apt.review && (
            <div className="bg-white p-6 rounded-xl border border-primary/30 shadow-sm mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Evaluează Intervenția</h3>
              <p className="text-sm text-gray-600 mb-4">Feedback-ul tău ne ajută să îmbunătățim serviciile.</p>
              
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary resize-none text-sm mb-4"
                rows={3}
                placeholder="Lasă un comentariu (opțional)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              
              <button
                onClick={() => submitReviewMutation.mutate({ appointment: apt.id, rating, comment })}
                disabled={submitReviewMutation.isPending}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {submitReviewMutation.isPending ? 'Se trimite...' : 'Trimite Review'}
              </button>
            </div>
          )}
          
          {isCompleted && apt.review && (
            <div className="bg-green-50 p-6 rounded-xl border border-green-200 mt-6">
              <h3 className="font-bold text-green-900 mb-2">Ai evaluat această intervenție</h3>
              <div className="flex text-yellow-500 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>{apt.review.rating >= star ? '★' : '☆'}</span>
                ))}
              </div>
              {apt.review.comment && (
                <p className="text-sm text-green-800 italic">"{apt.review.comment}"</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;
