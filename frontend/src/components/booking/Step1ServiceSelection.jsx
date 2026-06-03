import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import useBookingStore from '../../store/bookingStore';

const Step1ServiceSelection = () => {
  const { setCategoryAndService, nextStep, selectedServiceId } = useBookingStore();
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  // Fetch Categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/services/categories/');
      return response.data;
    }
  });

  // Fetch Services for selected category
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['services', activeCategoryId],
    queryFn: async () => {
      if (!activeCategoryId) return [];
      const response = await api.get(`/services/services/?category=${activeCategoryId}`);
      return response.data;
    },
    enabled: !!activeCategoryId
  });

  const handleServiceSelect = (serviceId) => {
    setCategoryAndService(activeCategoryId, serviceId);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Alege serviciul dorit</h2>
      
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Selectează Categoria</h3>
        {isLoadingCategories ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1,2,3].map(i => <div key={i} className="h-24 w-32 bg-gray-100 rounded-lg animate-pulse flex-shrink-0"></div>)}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`flex-shrink-0 w-36 p-4 rounded-xl border-2 transition-all text-center ${
                  activeCategoryId === cat.id 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-gray-200 hover:border-primary/50 bg-white'
                }`}
              >
                <div className="font-medium text-sm text-gray-900">{cat.name}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {activeCategoryId && (
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Selectează Serviciul</h3>
          {isLoadingServices ? (
            <div className="space-y-3">
              {[1,2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services?.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    selectedServiceId === service.id
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                      : 'border-gray-200 hover:border-primary/50 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">{service.name}</span>
                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      {service.base_price} RON
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{service.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end pt-6 border-t border-gray-100 mt-8">
        <button
          onClick={nextStep}
          disabled={!selectedServiceId}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pasul următor
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Step1ServiceSelection;
