import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Wrench, ChevronRight } from 'lucide-react';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';

const ClientDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('active');

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await api.get('/appointments/appointments/');
      return response.data;
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
      case 'pending': return 'În așteptare';
      case 'confirmed': return 'Confirmat';
      case 'in_progress': return 'În lucru';
      case 'completed': return 'Finalizat';
      case 'cancelled': return 'Anulat';
      case 'failed': return 'Nerealizat';
      default: return status;
    }
  };

  const activeAppointments = appointments?.filter(a => ['pending', 'confirmed', 'in_progress'].includes(a.status)) || [];
  const pastAppointments = appointments?.filter(a => ['completed', 'cancelled', 'failed'].includes(a.status)) || [];

  const displayAppointments = activeTab === 'active' ? activeAppointments : pastAppointments;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Salut, {user?.first_name}!</h1>
          <p className="mt-2 text-gray-600">Aici poți gestiona toate programările tale pentru intervenții.</p>
        </div>
        <Link to="/services" className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm inline-flex items-center justify-center">
          <Wrench className="w-4 h-4 mr-2" />
          Programează o intervenție
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('active')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'active'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Programări Active ({activeAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'past'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Istoric ({pastAppointments.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>)}
            </div>
          ) : displayAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Nicio programare găsită</h3>
              <p className="text-gray-500 mt-1">Nu ai nicio programare în această secțiune.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayAppointments.map((apt) => (
                <Link 
                  key={apt.id} 
                  to={`/appointments/${apt.id}`}
                  className="block bg-white border border-gray-200 rounded-lg p-5 hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusColor(apt.status)}`}>
                          {getStatusText(apt.status)}
                        </span>
                        <span className="text-sm text-gray-500">ID: #{apt.id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{apt.service_detail?.name || 'Serviciu Tehnic'}</h3>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {apt.scheduled_date ? format(new Date(apt.scheduled_date), 'dd MMM yyyy', { locale: ro }) : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {apt.time_slot_start}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {apt.address_detail?.city || 'Locație nesetată'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-primary font-medium text-sm md:border-l md:border-gray-100 md:pl-6">
                      Vezi detalii <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
