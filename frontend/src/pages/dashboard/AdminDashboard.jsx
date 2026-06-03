import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Wrench, CalendarCheck, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/axios';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin_stats'],
    queryFn: async () => {
      const response = await api.get('/analytics/stats/');
      return response.data;
    }
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Se încarcă analizele...</div>;
  }

  const chartData = stats?.appointments_by_day?.map(item => ({
    name: item.date.split('-').slice(1).join('/'),
    Programari: item.count
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Sumar general al activității platformei TechSchedule.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Venituri (Luna Curentă)</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.revenue_this_month} RON</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <CalendarCheck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Programări</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.total_appointments}</h3>
            <p className="text-xs text-gray-500 mt-1">{stats?.completed_appointments} finalizate</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Wrench className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tehnicieni Activi</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.active_technicians} / {stats?.total_technicians}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Clienți Înregistrați</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.total_clients}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Evoluție Programări (Ultimele 7 zile)
            </h3>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="Programari" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Acțiuni Rapide</h3>
          <div className="space-y-3">
            <Link to="/admin/appointments" className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors font-medium text-gray-700">
              Toate Programările
            </Link>
            <a href="http://localhost:8000/admin/technicians/technician/" target="_blank" rel="noreferrer" className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors font-medium text-gray-700">
              Gestionează Tehnicieni (Django)
            </a>
            <a href="http://localhost:8000/admin/services/service/" target="_blank" rel="noreferrer" className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors font-medium text-gray-700">
              Gestionează Servicii (Django)
            </a>
            <a href="http://localhost:8000/admin/" target="_blank" rel="noreferrer" className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors font-medium text-gray-700">
              Setări Complete Platformă
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
