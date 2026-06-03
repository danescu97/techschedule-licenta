import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Wrench, Zap, Monitor, ArrowRight, ShieldCheck, Clock, Star } from 'lucide-react';
import api from '../../api/axios';

const HomePage = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/services/categories/');
      return response.data;
    }
  });

  // Helper to map string icon names from DB to actual lucide icons
  const renderIcon = (iconName, className) => {
    switch (iconName?.toLowerCase()) {
      case 'zap': return <Zap className={className} />;
      case 'monitor': return <Monitor className={className} />;
      case 'wrench': default: return <Wrench className={className} />;
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight mb-6">
              Servicii tehnice la <span className="text-blue-200">standarde înalte</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10">
              Reparații IT, electrocasnice și instalații, direct la tine acasă sau la birou. Simplu, rapid și transparent.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/services" className="bg-white text-primary px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-50 transition-colors">
                Vezi serviciile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-primary rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Garanția Calității</h3>
              <p className="text-gray-600">Tehnicieni verificați și lucrări cu garanție inclusă pentru liniștea ta.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Intervenție Rapidă</h3>
              <p className="text-gray-600">Alegi tu slotul orar potrivit, iar noi ne prezentăm punctual la locație.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Transparență Totală</h3>
              <p className="text-gray-600">Vezi tarifele înainte de a rezerva și poți citi recenziile clienților anteriori.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Categorii de servicii</h2>
            <p className="mt-4 text-gray-600">Alege din gama noastră variată de intervenții specializate.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories?.map((category) => (
                <Link 
                  key={category.id} 
                  to={`/services?category=${category.id}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="h-2 w-full" style={{ backgroundColor: category.color || '#3b82f6' }}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center" style={{ color: category.color || '#3b82f6' }}>
                        {renderIcon(category.icon, "w-6 h-6")}
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {category.description || `Servicii profesionale pentru ${category.name.toLowerCase()}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
