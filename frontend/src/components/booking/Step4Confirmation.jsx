import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { ArrowLeft, CheckCircle2, Wrench, MapPin, CalendarClock, User as UserIcon, CreditCard, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';
import useBookingStore from '../../store/bookingStore';

const Step4Confirmation = () => {
  const navigate = useNavigate();
  const { 
    selectedServiceId, 
    selectedAddressId, 
    selectedTechnicianId, 
    selectedDate, 
    selectedTimeSlot, 
    description,
    setDescription,
    prevStep,
    resetBooking
  } = useBookingStore();

  // Fetch summaries
  const { data: service } = useQuery({
    queryKey: ['service', selectedServiceId],
    queryFn: async () => {
      const response = await api.get(`/services/services/${selectedServiceId}/`);
      return response.data;
    },
    enabled: !!selectedServiceId
  });

  const { data: address } = useQuery({
    queryKey: ['address', selectedAddressId],
    queryFn: async () => {
      const response = await api.get(`/auth/addresses/${selectedAddressId}/`);
      return response.data;
    },
    enabled: !!selectedAddressId
  });

  const { data: tech } = useQuery({
    queryKey: ['technician', selectedTechnicianId],
    queryFn: async () => {
      const response = await api.get(`/technicians/technicians/${selectedTechnicianId}/`);
      return response.data;
    },
    enabled: !!selectedTechnicianId
  });

  // Final booking mutation
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData) => {
      // Temporarily hit a fake endpoint if appointments API is not ready, 
      // but assuming it will be ready soon. For now we will assume the structure.
      const response = await api.post('/appointments/appointments/', appointmentData);
      return response.data;
    },
    onSuccess: (data) => {
      resetBooking();
      navigate('/dashboard', { state: { bookingSuccess: true } });
    }
  });

  const handleConfirm = () => {
    createAppointmentMutation.mutate({
      service: selectedServiceId,
      address: selectedAddressId,
      technician: selectedTechnicianId,
      scheduled_date: format(selectedDate, 'yyyy-MM-dd'),
      scheduled_time: selectedTimeSlot,
      description: description
    });
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Confirmare Rezervare</h2>

      {createAppointmentMutation.isError && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          A apărut o eroare la salvarea programării. Te rugăm să încerci din nou.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-primary">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase">Serviciu Selectat</h4>
              <p className="font-bold text-gray-900 text-lg">{service?.name || 'Se încarcă...'}</p>
              <div className="flex gap-4 mt-1 text-sm">
                <span className="text-green-600 font-medium">{service?.base_price} RON estimat</span>
                <span className="text-gray-500">~{service?.duration_min} min</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-primary">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase">Data și Ora</h4>
              <p className="font-bold text-gray-900 text-lg">
                {selectedDate ? format(selectedDate, 'EEEE, d MMMM yyyy', { locale: ro }) : ''}
              </p>
              <p className="text-gray-600 font-medium">Ora: {selectedTimeSlot}</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase">Locație Intervenție</h4>
              <p className="font-bold text-gray-900">{address?.label}</p>
              <p className="text-gray-600 text-sm">{address?.street}</p>
              <p className="text-gray-600 text-sm">{address?.city}, {address?.county}</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-primary">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase">Tehnician Alocat</h4>
              <p className="font-bold text-gray-900">{tech?.user?.first_name} {tech?.user?.last_name}</p>
              <p className="text-yellow-500 text-sm font-medium">★ {tech?.rating?.toFixed(1)} rating</p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4">Detalii suplimentare pentru tehnician (opțional)</h4>
            <textarea
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary resize-none"
              placeholder="Ex: Soneria nu merge, vă rog să mă sunați când ajungeți..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="mt-6 space-y-4">
              <div className="flex gap-3 text-sm text-gray-600">
                <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p>Plata se va face direct la tehnician, după finalizarea lucrării (Cash sau Card).</p>
              </div>
              <div className="flex gap-3 text-sm text-gray-600">
                <CreditCard className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <p>Prețul afișat este estimativ pentru manoperă. Piesele de schimb vor fi facturate separat.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-100">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-3 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Înapoi
        </button>
        <button
          onClick={handleConfirm}
          disabled={createAppointmentMutation.isPending}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg disabled:opacity-50"
        >
          {createAppointmentMutation.isPending ? 'Se procesează...' : 'Confirmă Programarea'}
          {!createAppointmentMutation.isPending && <CheckCircle2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default Step4Confirmation;
