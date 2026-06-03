import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import useBookingStore from '../../store/bookingStore';
import Step1ServiceSelection from '../../components/booking/Step1ServiceSelection';
// Next steps to be implemented:
import Step2AddressSelection from '../../components/booking/Step2AddressSelection';
import Step3DateTimeSelection from '../../components/booking/Step3DateTimeSelection';
import Step4Confirmation from '../../components/booking/Step4Confirmation';

const steps = [
  { id: 1, name: 'Serviciu' },
  { id: 2, name: 'Locație' },
  { id: 3, name: 'Programare' },
  { id: 4, name: 'Confirmare' }
];

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentStep, setCategoryAndService, resetBooking } = useBookingStore();

  useEffect(() => {
    const serviceId = searchParams.get('service');
    const categoryId = searchParams.get('category');
    
    if (serviceId && categoryId) {
      setCategoryAndService(parseInt(categoryId), parseInt(serviceId));
    }
  }, [searchParams, setCategoryAndService]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1ServiceSelection />;
      case 2:
        return <Step2AddressSelection />;
      case 3:
        return <Step3DateTimeSelection />;
      case 4:
        return <Step4Confirmation />;
      default:
        return <Step1ServiceSelection />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-10">Rezervă o intervenție</h1>
        
        {/* Stepper Header */}
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center justify-between">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'w-full pr-8 sm:pr-20' : ''}`}>
                {stepIdx !== steps.length - 1 ? (
                  <div className="absolute top-4 left-0 -ml-px mt-0.5 w-full h-0.5 bg-gray-200" aria-hidden="true" />
                ) : null}
                
                <div className="relative flex flex-col items-center group">
                  <span className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium
                    ${currentStep > step.id ? 'bg-primary text-white' : 
                      currentStep === step.id ? 'border-2 border-primary bg-white text-primary' : 
                      'border-2 border-gray-300 bg-white text-gray-500'}`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </span>
                  <span className={`mt-2 text-xs font-medium sm:text-sm
                    ${currentStep >= step.id ? 'text-primary' : 'text-gray-500'}`}
                  >
                    {step.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="mt-12">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default BookingPage;
