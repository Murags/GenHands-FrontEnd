import React, { useState, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import donationService from '../../services/donationService';
import AddressInput from '../../components/AddressInput';
import { useCharities } from '../../hooks/useCharities';
import { useCategories } from '../../hooks/useCategories';
import Autocomplete from '../../components/Autocomplete';
import LoadingModal from '../../components/LoadingModal';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const DonationSubmission = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const { data: charities, isLoading: isLoadingCharities, isError: isCharityError } = useCharities();
  const { categories: donationCategories, isLoading: isLoadingCategories, isError: isCategoriesError } = useCategories();

  const navigate = useNavigate();
  const locationRouter = useLocation();
  const preselectedCharityId = locationRouter.state?.charityId;

  const charityList = useMemo(() => {
    if (!charities) return [];
    return charities.map((charity) => ({
      ...charity,
      displayName: charity.charityName || charity.name,
    }));
  }, [charities]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, touchedFields },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      charityId: preselectedCharityId || '',
      organizationType: 'individual',
      donationItems: [{ category: '', description: '', quantity: '', condition: 'good' }],
      requiresRefrigeration: false,
      fragileItems: false,
      availabilityType: 'flexible',
      urgencyLevel: 'medium',
      photoConsent: false,
      contactPreference: 'phone',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'donationItems',
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await donationService.submitDonation(data);
      setSubmissionSuccess(true);
      setCurrentStep(5);
    } catch (error) {
      if (error?.name === 'ValidationError' || error?.message?.toLowerCase().includes('required') || error?.response?.status === 400) {
        toast.error('Please fill in all donation details');
      } else {
        toast.error(error.message || 'An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const itemConditions = [
    { value: 'new', label: 'New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', description: 'Can wait 2-3 days', color: 'text-ghibli-green' },
    { value: 'medium', label: 'Medium Priority', description: 'Preferred within 24 hours', color: 'text-ghibli-yellow' },
    { value: 'high', label: 'High Priority', description: 'Urgent - same day pickup', color: 'text-ghibli-red' },
  ];

  const handleNext = async () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };
  const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const watchCharityId = watch('charityId');
  const watchedData = watch();

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
              step <= currentStep ? 'bg-ghibli-teal text-white' : 'bg-ghibli-brown-light text-ghibli-brown'
            }`}
          >
            {step < currentStep ? <CheckCircleIcon className="h-6 w-6" /> : step}
          </div>
          {step < 4 && <div className={`w-16 h-1 mx-2 ${step < currentStep ? 'bg-ghibli-teal' : 'bg-ghibli-brown-light'}`} />}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="cursor-pointer fixed top-4 left-4 bg-white border-1 border-black text-black rounded-full p-2 shadow hover:bg-gray-100 transition"
        aria-label="Go back"
      >
        <FiArrowLeft size={20} />
      </button>

       <div className="text-center mb-8">
         <h2 className="text-2xl font-bold text-ghibli-dark-blue font-sans mb-2">Donor Information</h2>
         <p className="text-ghibli-brown">Tell us about yourself and pickup location</p>
       </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue">Personal Details</h3>
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Phone Number (Optional)</label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-3 h-5 w-5 text-ghibli-brown" />
              <input type="tel" {...register('donorPhone')} className="w-full pl-10 pr-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent" placeholder="+254 712 345 678" />
            </div>
            <p className="text-xs text-ghibli-brown mt-1">Provide if it's different from your account's number.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Organization Type</label>
            <select {...register('organizationType')} className="cursor-pointer w-full px-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent">
              <option value="individual">Individual</option>
              <option value="business">Business</option>
              <option value="organization">Organization</option>
              <option value="school">School</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>
           <div>
             <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Organization Name (if applicable)</label>
             <input type="text" {...register('organizationName')} className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent" placeholder="Company, school, or organization name" />
           </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue">Pickup Location</h3>
          <Controller
            name="pickupAddress"
            control={control}
            rules={{ required: 'Pickup address is required' }}
            render={({ field }) => (
              <AddressInput
                label="Pickup Address *"
                value={field.value || ''}
                onChange={field.onChange}
                onLocationSelect={(location) => {
                  setValue('pickupAddress', location.address, { shouldValidate: true });
                  setValue('pickupCoordinates', location.coordinates);
                  field.onChange(location.address);
                }}
                placeholder="Search for your location..."
                required
              />
            )}
          />
          {errors.pickupAddress && <p className="text-red-500 text-sm mt-1">{errors.pickupAddress.message}</p>}
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Access Instructions</label>
            <textarea {...register('accessNotes')} className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent" placeholder="Gate code, building floor, etc." rows="2" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-ghibli-dark-blue font-sans mb-2">Donation Details</h2>
        <p className="text-ghibli-brown">What are you donating?</p>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue">Items to Donate</h3>
          <button type="button" onClick={() => append({ category: '', description: '', quantity: '', condition: 'good' })} className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-ghibli-teal text-white rounded-lg hover:bg-opacity-90 transition-colors">
            <PlusIcon className="cursor-pointer h-4 w-4" />
            <span>Add Item</span>
          </button>
        </div>
        {fields.map((item, index) => (
          <div key={item.id} className="p-4 border border-ghibli-brown-light rounded-lg bg-ghibli-cream-lightest">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Category *</label>
                <Controller
                  name={`donationItems.${index}.category`}
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <Autocomplete
                      placeholder={isLoadingCategories ? 'Loading categories...' : 'Search for a category'}
                      options={donationCategories || []}
                      value={field.value}
                      onChange={field.onChange}
                      optionLabelKey="name"
                      optionValueKey="_id"
                      isLoading={isLoadingCategories}
                      isError={isCategoriesError}
                      required
                    />
                  )}
                />
                {errors.donationItems?.[index]?.category && <p className="text-red-500 text-sm mt-1">{errors.donationItems[index].category.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Description *</label>
                <input type="text" {...register(`donationItems.${index}.description`, { required: 'Description is required' })} className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent" placeholder="Describe the items" required/>
                {errors.donationItems?.[index]?.description && <p className="text-red-500 text-sm mt-1">{errors.donationItems[index].description.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Quantity</label>
                <input type="text" {...register(`donationItems.${index}.quantity`)} className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent" placeholder="e.g., 5 bags, 20 books" />
              </div>
              <div className="flex items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Condition</label>
                  <select {...register(`donationItems.${index}.condition`)} className="cursor-pointer w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent">
                    {itemConditions.map(condition => (
                      <option key={condition.value} value={condition.value}>{condition.label}</option>
                    ))}
                  </select>
                </div>
                {fields.length > 1 && <button type="button" onClick={() => remove(index)} className="cursor-pointer ml-2 p-2 text-ghibli-red hover:bg-ghibli-red hover:text-white rounded-lg transition-colors"><TrashIcon className="cursor-pointer h-4 w-4" /></button>}
              </div>
            </div>
          </div>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Estimated Total Weight</label>
            <input type="text" {...register('totalWeight')} className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent" placeholder="e.g., 50 kg, Light, Heavy" />
          </div>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" {...register('requiresRefrigeration')} className="cursor-pointer w-4 h-4 text-ghibli-teal bg-gray-100 border-gray-300 rounded focus:ring-ghibli-teal" />
              <span className="cursor-pointer ml-2 text-sm text-ghibli-dark-blue">Requires refrigeration</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" {...register('fragileItems')} className="cursor-pointer w-4 h-4 text-ghibli-teal bg-gray-100 border-gray-300 rounded focus:ring-ghibli-teal" />
              <span className="cursor-pointer ml-2 text-sm text-ghibli-dark-blue">Contains fragile items</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-ghibli-dark-blue font-sans mb-2">Delivery & Scheduling</h2>
        <p className="text-ghibli-brown">Where should we deliver and when?</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue">Delivery Destination</h3>
          <div>
            <Controller
              name="charityId"
              control={control}
              rules={{ required: 'Please select a charity' }}
              render={({ field }) => (
                <Autocomplete
                  label="Deliver to Charity *"
                  icon={BuildingOfficeIcon}
                  placeholder={isLoadingCharities ? 'Loading charities...' : 'Search for a destination charity'}
                  options={charityList}
                  value={field.value}
                  onChange={field.onChange}
                  optionLabelKey="displayName"
                  optionValueKey="_id"
                  isLoading={isLoadingCharities}
                  isError={isCharityError}
                  required
                />
              )}
            />
            {errors.charityId && <p className="text-red-500 text-sm mt-1">{errors.charityId.message}</p>}
            {watchCharityId && (
              <p className="mt-2 text-sm text-ghibli-brown">
                <MapPinIcon className="h-4 w-4 inline-block mr-1" />
                {charityList.find((c) => c._id === watchCharityId)?.address || 'Address not specified'}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Delivery Instructions</label>
            <textarea {...register('deliveryInstructions')} className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg" rows="2" />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue">Pickup Scheduling</h3>
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Urgency Level *</label>
            <div className="space-y-2">
              {urgencyLevels.map((level) => (
                <label key={level.value} className="flex items-center p-3 border border-ghibli-brown-light rounded-lg hover:bg-ghibli-cream-lightest cursor-pointer">
                  <input type="radio" {...register('urgencyLevel', { required: true })} value={level.value} className="w-4 h-4 text-ghibli-teal bg-gray-100 border-gray-300 focus:ring-ghibli-teal" />
                  <div className="ml-3">
                    <div className={`font-medium ${level.color}`}>{level.label}</div>
                    <div className="text-sm text-ghibli-brown">{level.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Availability Type</label>
            <select {...register('availabilityType')} className="cursor-pointer w-full px-4 py-3 border border-ghibli-brown-light rounded-lg">
              <option value="flexible">Flexible - anytime</option>
              <option value="urgent">Urgent - ASAP</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const selectedCharity = charityList.find((c) => c._id === watchedData.charityId);
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-ghibli-dark-blue font-sans mb-2">Review & Submit</h2>
          <p className="text-ghibli-brown">Please review your donation details</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
            <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-4">Donor Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Phone:</strong> {watchedData.donorPhone || 'Not provided'}</p>
              {watchedData.organizationName && <p><strong>Organization:</strong> {watchedData.organizationName}</p>}
              <p><strong>Type:</strong> {watchedData.organizationType}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
            <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-4">Pickup Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Address:</strong> {watchedData.pickupAddress}</p>
              {watchedData.accessNotes && <p><strong>Access Notes:</strong> {watchedData.accessNotes}</p>}
              <p><strong>Urgency:</strong> <span className={urgencyLevels.find(l => l.value === watchedData.urgencyLevel)?.color}>{urgencyLevels.find(l => l.value === watchedData.urgencyLevel)?.label}</span></p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
            <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-4">Donation Items</h3>
            <div className="space-y-3">
              {watchedData.donationItems?.map((item, index) => {
                const categoryName = donationCategories?.find(cat => cat._id === item.category)?.name || item.category;
                return (
                  <div key={index} className="p-3 bg-ghibli-cream-lightest rounded-lg">
                    <p className="font-medium text-ghibli-dark-blue">{categoryName}</p>
                    <p className="text-sm text-ghibli-brown">{item.description}</p>
                    {item.quantity && <p className="text-sm text-ghibli-brown">Quantity: {item.quantity}</p>}
                    <p className="text-sm text-ghibli-brown">Condition: {item.condition}</p>
                  </div>
                );
              })}
            </div>
            {watchedData.totalWeight && <p className="mt-3 text-sm"><strong>Total Weight:</strong> {watchedData.totalWeight}</p>}
          </div>
          <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
            <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-4">Delivery Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Destination Charity:</strong> {selectedCharity?.displayName}</p>
              <p><strong>Delivery Address:</strong> {selectedCharity?.address}</p>
              {watchedData.deliveryInstructions && <p><strong>Instructions:</strong> {watchedData.deliveryInstructions}</p>}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-4">Additional Information</h3>
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Additional Notes</label>
            <textarea {...register('additionalNotes')} className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg" placeholder="Any additional information for the volunteer" rows="3" />
          </div>
          <div className="mt-4 space-y-3">
            <label className="flex items-center">
              <input type="checkbox" {...register('photoConsent')} className="cursor-pointer w-4 h-4" />
              <span className="cursor-pointer ml-2 text-sm text-ghibli-dark-blue">I consent to photos being taken.</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">Preferred Contact Method</label>
              <select {...register('contactPreference')} className="cursor-pointer w-full px-4 py-3 border border-ghibli-brown-light rounded-lg">
                <option value="phone">Phone call</option>
                <option value="sms">SMS/Text message</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="cursor-pointer px-8 py-3 bg-ghibli-green text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <TruckIcon className="h-5 w-5" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <TruckIcon className="h-5 w-5" />
                <span>Submit Donation</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-20 h-20 bg-ghibli-green rounded-full flex items-center justify-center">
        <CheckCircleIcon className="h-12 w-12 text-white" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-ghibli-dark-blue font-sans mb-4">Donation Submitted Successfully! 🎉</h2>
        <p className="text-lg text-ghibli-brown mb-6">Thank you for your generous donation! Your request has been submitted and volunteers in your area will be notified.</p>
      </div>
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6 max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-4">What happens next?</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-ghibli-teal rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
            <p className="text-sm text-ghibli-brown">Volunteers in your area will be notified of your donation</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-ghibli-teal rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
            <p className="text-sm text-ghibli-brown">A volunteer will contact you to arrange pickup</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-ghibli-teal rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
            <p className="text-sm text-ghibli-brown">Your donation will be safely delivered to the chosen charity</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <button onClick={() => { reset(); setCurrentStep(1); setSubmissionSuccess(false); }} className="cursor-pointer px-6 py-3 bg-ghibli-teal text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors">
          Submit Another Donation
        </button>
        <button onClick={() => (window.location.href = '/donor/my-donations')} className="cursor-pointer px-6 py-3 bg-ghibli-brown text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors">
          View Donations
        </button>
      </div>
    </div>
  );

  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-ghibli-cream py-8">
        <div className="max-w-4xl mx-auto px-4">{renderSuccessStep()}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ghibli-cream py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-ghibli-dark-blue handwritten mb-2">Submit a Donation 🎁</h1>
          <p className="text-lg text-ghibli-brown">Help us connect your generous donation with those who need it most</p>
        </div>
        {renderStepIndicator()}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-8 mb-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>
          <div className="flex justify-between items-center">
            <button type="button" onClick={handlePrevious} disabled={currentStep === 1} className={`cursor-pointer px-6 py-3 rounded-lg font-medium transition-colors ${currentStep === 1 ? 'bg-ghibli-brown-light text-ghibli-brown cursor-not-allowed' : 'bg-ghibli-brown text-white hover:bg-opacity-90'}`}>
              Previous
            </button>
            <div className="text-sm text-ghibli-brown">Step {currentStep} of 4</div>
            {currentStep < 4 && (
              <button type="button" onClick={handleNext} className={`cursor-pointer px-6 py-3 rounded-lg font-medium transition-colors bg-ghibli-teal text-white hover:bg-opacity-90`}>
                Next
              </button>
            )}
          </div>
        </form>
        <div className="mt-8 bg-ghibli-blue bg-opacity-10 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="h-6 w-6 text-ghibli-blue mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-2">Need Help?</h3>
              <p className="text-sm text-white mb-2">If you have questions about the donation process or need assistance, please contact us:</p>
              <div className="text-sm text-white space-y-1">
                <p>📞 Phone: +254 757 700 440</p>
                <p>📧 Email: jannyjonyo1@gmail.com</p>
                <p>🕒 Available: Monday - Friday, 8:15 AM - 5:15 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Modal */}
      <LoadingModal
        isVisible={isSubmitting}
        message="Submitting your donation..."
        size="medium"
      />
    </div>
  );
};

export default DonationSubmission;
