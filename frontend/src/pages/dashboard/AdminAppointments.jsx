import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import api from '../../api/axios';

const AdminAppointments = () => {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['admin_appointments_list'],
    queryFn: async () => {
      const response = await api.get('/appointments/appointments/');
      return response.data;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Înapoi la dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Toate Programările</h1>
          <p className="text-gray-600 mt-1">Gestionează toate intervențiile din platformă.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Caută ID, Client..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary w-full md:w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
            <Filter className="w-4 h-4" />
            Filtre
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Tehnician</th>
                <th className="px-6 py-4">Serviciu</th>
                <th className="px-6 py-4">Dată</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Se încarcă datele...</td>
                </tr>
              ) : appointments?.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Nicio programare găsită.</td>
                </tr>
              ) : (
                appointments?.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{apt.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{apt.client_detail?.first_name} {apt.client_detail?.last_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {apt.technician_detail ? `${apt.technician_detail.user.first_name} ${apt.technician_detail.user.last_name}` : <span className="text-gray-400 italic">Nealocat</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{apt.service_detail?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{apt.scheduled_date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold
                        ${apt.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          ['cancelled', 'failed'].includes(apt.status) ? 'bg-red-100 text-red-800' : 
                          'bg-blue-100 text-blue-800'}`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <Link to={`/appointments/${apt.id}`} className="text-primary hover:text-primary-dark font-medium mr-3">Vezi</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
