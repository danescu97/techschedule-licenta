import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Save } from 'lucide-react';
// In a real app we'd fetch the schedule and use mutations to update it
// We will mock this for now since it's mainly UI functionality for Part 17

const days = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică'];

const TechnicianSchedule = () => {
  const [schedule, setSchedule] = useState({
    0: { isWorking: true, start: '09:00', end: '18:00' },
    1: { isWorking: true, start: '09:00', end: '18:00' },
    2: { isWorking: true, start: '09:00', end: '18:00' },
    3: { isWorking: true, start: '09:00', end: '18:00' },
    4: { isWorking: true, start: '09:00', end: '16:00' },
    5: { isWorking: false, start: '10:00', end: '14:00' },
    6: { isWorking: false, start: '10:00', end: '14:00' },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggleWork = (dayIndex) => {
    setSchedule(prev => ({
      ...prev,
      [dayIndex]: { ...prev[dayIndex], isWorking: !prev[dayIndex].isWorking }
    }));
  };

  const handleTimeChange = (dayIndex, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [dayIndex]: { ...prev[dayIndex], [field]: value }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
    // Ideally this hits api.post('/technicians/schedules/')
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Înapoi la dashboard
      </Link>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Program de Lucru</h1>
            <p className="text-gray-500 text-sm">Configurează zilele și orele în care ești disponibil pentru clienți.</p>
          </div>
        </div>

        <div className="space-y-4">
          {days.map((day, idx) => {
            const data = schedule[idx];
            return (
              <div key={idx} className={`p-4 rounded-lg border transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 
                ${data.isWorking ? 'border-primary/30 bg-primary/5' : 'border-gray-200 bg-gray-50 opacity-75'}`}
              >
                <div className="flex items-center gap-4 w-40">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={data.isWorking}
                      onChange={() => handleToggleWork(idx)}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <span className={`font-bold ${data.isWorking ? 'text-gray-900' : 'text-gray-500'}`}>{day}</span>
                </div>

                {data.isWorking ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">De la</span>
                      <input 
                        type="time" 
                        value={data.start}
                        onChange={(e) => handleTimeChange(idx, 'start', e.target.value)}
                        className="p-2 border border-gray-300 rounded-md text-sm font-medium focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <span className="text-gray-300">-</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Până la</span>
                      <input 
                        type="time" 
                        value={data.end}
                        onChange={(e) => handleTimeChange(idx, 'end', e.target.value)}
                        className="p-2 border border-gray-300 rounded-md text-sm font-medium focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 font-medium italic">Indisponibil</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Se salvează...' : 'Salvează Programul'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianSchedule;
