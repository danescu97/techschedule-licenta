import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { ro } from 'date-fns/locale';
import { ArrowRight, ArrowLeft, Calendar, Clock, User as UserIcon } from 'lucide-react';
import api from '../../api/axios';
import useBookingStore from '../../store/bookingStore';

const Step3DateTimeSelection = () => {
  const { setTechnicianAndSlot, nextStep, prevStep, selectedDate, selectedTimeSlot, selectedTechnicianId } = useBookingStore();
  const [localDate, setLocalDate] = useState(selectedDate || startOfToday());
  const [localTechnicianId, setLocalTechnicianId] = useState(selectedTechnicianId);
  const [localTimeSlot, setLocalTimeSlot] = useState(selectedTimeSlot);

  // Generăm următoarele 14 zile pentru calendar
  const next14Days = Array.from({ length: 14 }).map((_, i) => addDays(startOfToday(), i));

  // Fetch Technicians
  const { data: technicians, isLoading: isLoadingTechs } = useQuery({
    queryKey: ['technicians'],
    queryFn: async () => {
      const response = await api.get('/technicians/technicians/');
      return response.data;
    }
  });

  // Dummy slots - normally these would be fetched from backend based on tech schedule and existing appointments
  const generateSlots = () => {
    return ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  };
  const availableSlots = generateSlots();

  useEffect(() => {
    if (localTechnicianId && localDate && localTimeSlot) {
      setTechnicianAndSlot(localTechnicianId, localDate, localTimeSlot);
    }
  }, [localTechnicianId, localDate, localTimeSlot, setTechnicianAndSlot]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Alege Data și Tehnicianul</h2>

      <div className="space-y-8">
        {/* Tehnician Selection */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Selectează Tehnicianul</h3>
          {isLoadingTechs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technicians?.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => setLocalTechnicianId(tech.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                    localTechnicianId === tech.id
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                      : 'border-gray-200 hover:border-primary/50 bg-white'
                  }`}
                >
                  {tech.user?.profile_photo ? (
                    <img src={tech.user.profile_photo} alt={tech.user.first_name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                      <UserIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900">{tech.user?.first_name} {tech.user?.last_name}</h4>
                    <div className="flex items-center text-xs text-yellow-500 font-medium">
                      ★ {tech.rating.toFixed(1)} ({tech.total_reviews} recenzii)
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Selection */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Data intervenției
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {next14Days.map((date, idx) => (
              <button
                key={idx}
                onClick={() => { setLocalDate(date); setLocalTimeSlot(null); }}
                className={`flex-shrink-0 w-20 p-3 rounded-xl border-2 text-center transition-all ${
                  localDate && isSameDay(localDate, date)
                    ? 'border-primary bg-primary text-white shadow-sm ring-1 ring-primary'
                    : 'border-gray-200 hover:border-primary/50 bg-white text-gray-700'
                }`}
              >
                <div className="text-xs uppercase font-medium mb-1 opacity-80">
                  {format(date, 'eee', { locale: ro })}
                </div>
                <div className="text-xl font-bold">
                  {format(date, 'dd')}
                </div>
                <div className="text-xs font-medium opacity-80">
                  {format(date, 'MMM', { locale: ro })}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        {localDate && localTechnicianId && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Ora intervenției
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setLocalTimeSlot(slot)}
                  className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                    localTimeSlot === slot
                      ? 'border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary'
                      : 'border-gray-200 hover:border-primary/50 bg-white text-gray-700'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-100 mt-8">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-3 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Înapoi
        </button>
        <button
          onClick={nextStep}
          disabled={!localTechnicianId || !localDate || !localTimeSlot}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pasul următor
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Step3DateTimeSelection;
