import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Calendar, Clock, MapPin, User as UserIcon, CheckCircle2, ChevronRight, PenTool } from 'lucide-react';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';

const TechnicianDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('today');
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments_tech'],
    queryFn: async () => {
      const response = await api.get('/appointments/appointments/');
      return response.data;
    }
  });

  const changeStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await api.post(`/appointments/appointments/${id}/change_status/`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments_tech'] });
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Nouă';
      case 'confirmed': return 'Confirmată';
      case 'in_progress': return 'În lucru';
      case 'completed': return 'Finalizată';
      case 'cancelled': return 'Anulată';
      case 'failed': return 'Eșuată';
      default: return status;
    }
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  
  const todayAppointments = appointments?.filter(a => 
    a.scheduled_date === today && ['pending', 'confirmed', 'in_progress'].includes(a.status)
  ) || [];
  
  const upcomingAppointments = appointments?.filter(a => 
    a.scheduled_date !== today && ['pending', 'confirmed'].includes(a.status)
  ) || [];
  
  const displayAppointments = activeTab === 'today' ? todayAppointments : upcomingAppointments;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Tehnician</h1>
        <p className="mt-2 text-gray-600">Gestionează intervențiile și vezi programul zilei, {user?.first_name}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <button
            onClick={() => setActiveTab('today')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'today' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Intervenții de Azi
            <span className={`float-right px-2 py-0.5 rounded-full text-xs ${activeTab === 'today' ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
              {todayAppointments.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'upcoming' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Programări Viitoare
            <span className={`float-right px-2 py-0.5 rounded-full text-xs ${activeTab === 'upcoming' ? 'bg-white text-primary' : 'bg-gray-200 text-gray-700'}`}>
              {upcomingAppointments.length}
            </span>
          </button>

          <Link to="/technician/schedule" className="w-full block text-left px-4 py-3 rounded-lg font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors">
            Gestionează Orarul
          </Link>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {activeTab === 'today' ? 'Programul de Astăzi' : 'Următoarele Intervenții'}
              </h2>
              <span className="text-sm text-gray-500 font-medium">
                {format(new Date(), 'EEEE, d MMMM yyyy', { locale: ro })}
              </span>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>)}
                </div>
              ) : displayAppointments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Nicio intervenție programată</h3>
                  <p className="text-gray-500 mt-1">Ai liber deocamdată pentru această selecție.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayAppointments.map((apt) => (
                    <div key={apt.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-primary/30 transition-all shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusColor(apt.status)}`}>
                              {getStatusText(apt.status)}
                            </span>
                            <span className="text-sm font-bold text-gray-900">{apt.time_slot_start} - {apt.time_slot_end}</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">{apt.service_detail?.name}</h3>
                          
                          <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <UserIcon className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{apt.client_detail?.first_name} {apt.client_detail?.last_name}</span>
                              <span className="text-gray-400">({apt.client_detail?.phone})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span>{apt.address_detail?.street}, {apt.address_detail?.city}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[140px]">
                          {apt.status === 'pending' && (
                            <button 
                              onClick={() => changeStatusMutation.mutate({ id: apt.id, status: 'confirmed' })}
                              className="w-full bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                              Acceptă Lucrarea
                            </button>
                          )}
                          {apt.status === 'confirmed' && (
                            <button 
                              onClick={() => changeStatusMutation.mutate({ id: apt.id, status: 'in_progress' })}
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                              Pornește spre client
                            </button>
                          )}
                          {apt.status === 'in_progress' && (
                            <Link 
                              to={`/technician/report/${apt.id}`}
                              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                              <PenTool className="w-4 h-4" />
                              Raport Finalizare
                            </Link>
                          )}
                          
                          <Link 
                            to={`/appointments/${apt.id}`}
                            className="w-full text-center border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            Detalii Complete
                          </Link>
                        </div>
                      </div>
                      
                      {apt.problem_description && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nota Clientului</p>
                          <p className="text-sm text-gray-700 italic border-l-2 border-primary/50 pl-3">"{apt.problem_description}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
