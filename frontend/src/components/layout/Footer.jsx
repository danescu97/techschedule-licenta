import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">TechSchedule</span>
            </Link>
            <p className="text-sm text-gray-500">
              Servicii profesionale la un click distanță. Programări rapide și transparente.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Servicii</h3>
            <ul className="space-y-2">
              <li><Link to="/services?category=it" className="text-sm text-gray-600 hover:text-primary">Reparații IT</Link></li>
              <li><Link to="/services?category=electrocasnice" className="text-sm text-gray-600 hover:text-primary">Electrocasnice</Link></li>
              <li><Link to="/services?category=instalatii" className="text-sm text-gray-600 hover:text-primary">Instalații sanitare</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Companie</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-primary">Despre noi</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-primary">Contact</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-600 hover:text-primary">Termeni și condiții</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Suport</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-sm text-gray-600 hover:text-primary">Întrebări frecvente</Link></li>
              <li><span className="text-sm text-gray-600">contact@techschedule.ro</span></li>
              <li><span className="text-sm text-gray-600">0722 123 456</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 flex items-center justify-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} TechSchedule. Toate drepturile rezervate. Lucrare de licență.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
