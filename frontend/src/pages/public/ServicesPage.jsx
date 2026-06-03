import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Clock, CreditCard } from 'lucide-react';
import api from '../../api/axios';

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCategoryId = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/services/categories/');
      return response.data;
    }
  });

  // Fetch Services
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['services', activeCategoryId],
    queryFn: async () => {
      const url = activeCategoryId 
        ? `/services/services/?category=${activeCategoryId}` 
        : '/services/services/';
      const response = await api.get(url);
      return response.data;
    }
  });

  const handleCategoryClick = (id) => {
    if (activeCategoryId === id.toString()) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', id.toString());
    }
    setSearchParams(searchParams);
  };

  const filteredServices = services?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Servicii Disponibile</h1>
          <p className="mt-2 text-sm text-gray-600">Descoperă toate serviciile și alege-l pe cel potrivit pentru tine.</p>
        </div>
        
        <div className="mt-4 md:mt-0 relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
            placeholder="Caută serviciu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
            <h3 className="font-semibold text-gray-900 mb-4">Categorii</h3>
            {isLoadingCategories ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>)}
              </div>
            ) : (
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }}
                    className={`text-sm w-full text-left px-3 py-2 rounded-md transition-colors ${!activeCategoryId ? 'bg-primary-dark/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Toate categoriile
                  </button>
                </li>
                {categories?.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`text-sm w-full text-left px-3 py-2 rounded-md transition-colors ${activeCategoryId === cat.id.toString() ? 'bg-primary-dark/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Services List */}
        <div className="flex-1">
          {isLoadingServices ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                  <div className="flex justify-between">
                    <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServices?.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-lg border border-gray-200">
              <p className="text-gray-500 mb-4">Nu am găsit servicii conform criteriilor selectate.</p>
              <button 
                onClick={() => { setSearchTerm(''); searchParams.delete('category'); setSearchParams(searchParams); }}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Resetează filtrele
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredServices?.map((service) => (
                <div key={service.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{service.description}</p>
                    
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        ~{service.duration_min} min
                      </div>
                      <div className="flex items-center text-sm font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                        <CreditCard className="w-4 h-4 mr-1 text-green-500" />
                        {service.base_price} RON
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={() => navigate(`/booking?category=${service.category}&service=${service.id}`)}
                      className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                    >
                      Rezervă acum
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
