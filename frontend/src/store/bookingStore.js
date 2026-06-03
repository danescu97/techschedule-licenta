import { create } from 'zustand';

const useBookingStore = create((set) => ({
  currentStep: 1,
  
  // Booking Data
  selectedCategoryId: null,
  selectedServiceId: null,
  selectedAddressId: null,
  selectedTechnicianId: null,
  selectedDate: null,
  selectedTimeSlot: null,
  description: '',

  // Actions
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
  
  setCategoryAndService: (categoryId, serviceId) => set({ 
    selectedCategoryId: categoryId, 
    selectedServiceId: serviceId 
  }),
  
  setAddress: (addressId) => set({ selectedAddressId: addressId }),
  
  setTechnicianAndSlot: (technicianId, date, timeSlot) => set({
    selectedTechnicianId: technicianId,
    selectedDate: date,
    selectedTimeSlot: timeSlot
  }),

  setDescription: (desc) => set({ description: desc }),

  resetBooking: () => set({
    currentStep: 1,
    selectedCategoryId: null,
    selectedServiceId: null,
    selectedAddressId: null,
    selectedTechnicianId: null,
    selectedDate: null,
    selectedTimeSlot: null,
    description: '',
  })
}));

export default useBookingStore;
