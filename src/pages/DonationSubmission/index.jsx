import React, { useState, useEffect } from 'react';
import {
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  CalendarIcon,
  InformationCircleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { submitDonation, getCharities } from '../../services/donationService';
import AddressInput from '../../components/AddressInput';

const DonationSubmission = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [charityList, setCharityList] = useState([]);
  const [formData, setFormData] = useState({
    // Donor Information
    donorName: '',
    donorPhone: '',
    donorEmail: '',
    organizationName: '',
    organizationType: 'individual', // individual, business, organization

    // Pickup Location
    pickupAddress: '',
    pickupCoordinates: null,
    pickupInstructions: '',
    accessNotes: '',

    // Donation Details
    donationItems: [{ category: '', description: '', quantity: '', condition: 'good' }],
    totalWeight: '',
    requiresRefrigeration: false,
    fragileItems: false,

    // Delivery Information
    deliveryAddress: '',
    deliveryCoordinates: null,
    preferredCharity: '',
    preferredCharityId: '',
    deliveryInstructions: '',

    // Scheduling
    availabilityType: 'flexible', // flexible, specific, urgent
    preferredDate: '',
    preferredTimeStart: '',
    preferredTimeEnd: '',
    urgencyLevel: 'medium', // low, medium, high

    // Additional Information
    additionalNotes: '',
    photoConsent: false,
    contactPreference: 'phone' // phone, email, sms
  });

  const donationCategories = [
    'Food items',
    'Clothing & textiles',
    'Books & educational materials',
    'Household items',
    'Medical supplies',
    'Electronics',
    'Toys & games',
    'Furniture',
    'Other'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', description: 'Can wait 2-3 days', color: 'text-ghibli-green' },
    { value: 'medium', label: 'Medium Priority', description: 'Preferred within 24 hours', color: 'text-ghibli-yellow' },
    { value: 'high', label: 'High Priority', description: 'Urgent - same day pickup', color: 'text-ghibli-red' }
  ];

  // Get user location and charity list on component mount
  useEffect(() => {
    // Get user's current location to improve pickup geocoding
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Nairobi coordinates
          setUserLocation([-1.2921, 36.8219]);
        }
      );
    } else {
      setUserLocation([-1.2921, 36.8219]);
    }

    // Fetch the list of charities for the destination dropdown
    const fetchCharities = async () => {
      const charities = await getCharities();
      setCharityList(charities);
    };

    fetchCharities();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCharityChange = (charityId) => {
    if (!charityId) {
        setFormData(prev => ({
            ...prev,
            preferredCharityId: '',
            preferredCharity: '',
            deliveryAddress: '',
            deliveryCoordinates: null,
        }));
        return;
    }
    const selectedCharity = charityList.find(c => c.id === charityId);
    if (selectedCharity) {
        setFormData(prev => ({
            ...prev,
            preferredCharityId: selectedCharity.id,
            preferredCharity: selectedCharity.name,
            deliveryAddress: selectedCharity.address,
            deliveryCoordinates: selectedCharity.coordinates,
        }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.donationItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      donationItems: updatedItems
    }));
  };

  const addDonationItem = () => {
    setFormData(prev => ({
      ...prev,
      donationItems: [...prev.donationItems, { category: '', description: '', quantity: '', condition: 'good' }]
    }));
  };

  const removeDonationItem = (index) => {
    if (formData.donationItems.length > 1) {
      const updatedItems = formData.donationItems.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        donationItems: updatedItems
      }));
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.donorName && formData.donorPhone && formData.pickupAddress;
      case 2:
        return formData.donationItems.every(item => item.category && item.description);
      case 3:
        return formData.preferredCharityId && formData.urgencyLevel;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Use the donation service to submit the donation
      const result = await submitDonation(formData);

      if (result.success) {
        setSubmissionSuccess(true);
        setCurrentStep(5); // Success step
      } else {
        // Handle submission error
        console.error('Submission failed:', result.error);
        // You could show an error message to the user here
        alert('Failed to submit donation. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while submitting your donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
            step <= currentStep
              ? 'bg-ghibli-teal text-white'
              : 'bg-ghibli-brown-light text-ghibli-brown'
          }`}>
            {step < currentStep ? (
              <CheckCircleIcon className="h-6 w-6" />
            ) : (
              step
            )}
          </div>
          {step < 4 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-ghibli-teal' : 'bg-ghibli-brown-light'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-ghibli-dark-blue handwritten mb-2">Donor Information</h2>
        <p className="text-ghibli-brown">Tell us about yourself and pickup location</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue">Personal Details</h3>

          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Full Name *
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-ghibli-brown" />
              <input
                type="text"
                value={formData.donorName}
                onChange={(e) => handleInputChange('donorName', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-3 h-5 w-5 text-ghibli-brown" />
              <input
                type="tel"
                value={formData.donorPhone}
                onChange={(e) => handleInputChange('donorPhone', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                placeholder="+254 712 345 678"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.donorEmail}
              onChange={(e) => handleInputChange('donorEmail', e.target.value)}
              className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Organization Type
            </label>
            <select
              value={formData.organizationType}
              onChange={(e) => handleInputChange('organizationType', e.target.value)}
              className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
            >
              <option value="individual">Individual</option>
              <option value="business">Business</option>
              <option value="organization">Organization</option>
              <option value="school">School</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>
        </div>

        {/* Pickup Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue">Pickup Location</h3>

          <div>
            <AddressInput
              label="Pickup Address *"
              value={formData.pickupAddress}
              onChange={(value) => handleInputChange('pickupAddress', value)}
              placeholder="Search for your location, business, or landmark"
              required
              showNearbyPlaces={true}
              showCategories={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Access Instructions
            </label>
            <textarea
              value={formData.accessNotes}
              onChange={(e) => handleInputChange('accessNotes', e.target.value)}
              className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
              placeholder="Gate code, building floor, parking instructions, etc."
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Organization Name (if applicable)
            </label>
            <input
              type="text"
              value={formData.organizationName}
              onChange={(e) => handleInputChange('organizationName', e.target.value)}
              className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
              placeholder="Company, school, or organization name"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-ghibli-dark-blue handwritten mb-2">Donation Details</h2>
        <p className="text-ghibli-brown">What are you donating?</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue">Items to Donate</h3>
          <button
            onClick={addDonationItem}
            className="flex items-center space-x-2 px-4 py-2 bg-ghibli-teal text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Item</span>
          </button>
        </div>

        {formData.donationItems.map((item, index) => (
          <div key={index} className="p-4 border border-ghibli-brown-light rounded-lg bg-ghibli-cream-lightest">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
                  Category *
                </label>
                <select
                  value={item.category}
                  onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                  className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {donationCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                  placeholder="Describe the items"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
                  Quantity
                </label>
                <input
                  type="text"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                  placeholder="e.g., 5 bags, 20 books"
                />
              </div>

              <div className="flex items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
                    Condition
                  </label>
                  <select
                    value={item.condition}
                    onChange={(e) => handleItemChange(index, 'condition', e.target.value)}
                    className="w-full px-3 py-2 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
                {formData.donationItems.length > 1 && (
                  <button
                    onClick={() => removeDonationItem(index)}
                    className="ml-2 p-2 text-ghibli-red hover:bg-ghibli-red hover:text-white rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Estimated Total Weight
            </label>
            <input
              type="text"
              value={formData.totalWeight}
              onChange={(e) => handleInputChange('totalWeight', e.target.value)}
              className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
              placeholder="e.g., 50 kg, Light, Heavy"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.requiresRefrigeration}
                onChange={(e) => handleInputChange('requiresRefrigeration', e.target.checked)}
                className="w-4 h-4 text-ghibli-teal bg-gray-100 border-gray-300 rounded focus:ring-ghibli-teal"
              />
              <span className="ml-2 text-sm text-ghibli-dark-blue">Requires refrigeration</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.fragileItems}
                onChange={(e) => handleInputChange('fragileItems', e.target.checked)}
                className="w-4 h-4 text-ghibli-teal bg-gray-100 border-gray-300 rounded focus:ring-ghibli-teal"
              />
              <span className="ml-2 text-sm text-ghibli-dark-blue">Contains fragile items</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-ghibli-dark-blue handwritten mb-2">Delivery & Scheduling</h2>
        <p className="text-ghibli-brown">Where should we deliver and when?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Delivery Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue">Delivery Destination</h3>

          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Deliver to Charity *
            </label>
            <div className="relative">
              <BuildingOfficeIcon className="absolute left-3 top-3 h-5 w-5 text-ghibli-brown" />
              <select
                value={formData.preferredCharityId}
                onChange={(e) => handleCharityChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent appearance-none bg-white"
                required
              >
                <option value="">Select a destination charity</option>
                {charityList.map(charity => (
                  <option key={charity.id} value={charity.id}>
                    {charity.name}
                  </option>
                ))}
              </select>
            </div>
            {formData.deliveryAddress && (
              <p className="mt-2 text-sm text-ghibli-brown">
                <MapPinIcon className="h-4 w-4 inline-block mr-1" />
                {formData.deliveryAddress}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Delivery Instructions
            </label>
            <textarea
              value={formData.deliveryInstructions}
              onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
              className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
              placeholder="Special delivery instructions"
              rows="2"
            />
          </div>
        </div>

        {/* Scheduling */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue">Pickup Scheduling</h3>

          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Urgency Level *
            </label>
            <div className="space-y-2">
              {urgencyLevels.map(level => (
                <label key={level.value} className="flex items-center p-3 border border-ghibli-brown-light rounded-lg hover:bg-ghibli-cream-lightest cursor-pointer">
                  <input
                    type="radio"
                    name="urgencyLevel"
                    value={level.value}
                    checked={formData.urgencyLevel === level.value}
                    onChange={(e) => handleInputChange('urgencyLevel', e.target.value)}
                    className="w-4 h-4 text-ghibli-teal bg-gray-100 border-gray-300 focus:ring-ghibli-teal"
                  />
                  <div className="ml-3">
                    <div className={`font-medium ${level.color}`}>{level.label}</div>
                    <div className="text-sm text-ghibli-brown">{level.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Availability Type
            </label>
            <select
              value={formData.availabilityType}
              onChange={(e) => handleInputChange('availabilityType', e.target.value)}
              className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
            >
              <option value="flexible">Flexible - anytime</option>
              <option value="specific">Specific date/time</option>
              <option value="urgent">Urgent - ASAP</option>
            </select>
          </div>

          {formData.availabilityType === 'specific' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
                  Preferred Date
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-ghibli-brown" />
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
                    From Time
                  </label>
                  <div className="relative">
                    <ClockIcon className="absolute left-3 top-3 h-5 w-5 text-ghibli-brown" />
                    <input
                      type="time"
                      value={formData.preferredTimeStart}
                      onChange={(e) => handleInputChange('preferredTimeStart', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
                    To Time
                  </label>
                  <div className="relative">
                    <ClockIcon className="absolute left-3 top-3 h-5 w-5 text-ghibli-brown" />
                    <input
                      type="time"
                      value={formData.preferredTimeEnd}
                      onChange={(e) => handleInputChange('preferredTimeEnd', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-ghibli-dark-blue handwritten mb-2">Review & Submit</h2>
        <p className="text-ghibli-brown">Please review your donation details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Donor Information Summary */}
        <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-4">Donor Information</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Name:</strong> {formData.donorName}</p>
            <p><strong>Phone:</strong> {formData.donorPhone}</p>
            {formData.donorEmail && <p><strong>Email:</strong> {formData.donorEmail}</p>}
            {formData.organizationName && <p><strong>Organization:</strong> {formData.organizationName}</p>}
            <p><strong>Type:</strong> {formData.organizationType}</p>
          </div>
        </div>

        {/* Pickup Information Summary */}
        <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-4">Pickup Details</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Address:</strong> {formData.pickupAddress}</p>
            {formData.accessNotes && <p><strong>Access Notes:</strong> {formData.accessNotes}</p>}
            <p><strong>Urgency:</strong> <span className={urgencyLevels.find(l => l.value === formData.urgencyLevel)?.color}>
              {urgencyLevels.find(l => l.value === formData.urgencyLevel)?.label}
            </span></p>
          </div>
        </div>

        {/* Donation Items Summary */}
        <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-4">Donation Items</h3>
          <div className="space-y-3">
            {formData.donationItems.map((item, index) => (
              <div key={index} className="p-3 bg-ghibli-cream-lightest rounded-lg">
                <p className="font-medium text-ghibli-dark-blue">{item.category}</p>
                <p className="text-sm text-ghibli-brown">{item.description}</p>
                {item.quantity && <p className="text-sm text-ghibli-brown">Quantity: {item.quantity}</p>}
                <p className="text-sm text-ghibli-brown">Condition: {item.condition}</p>
              </div>
            ))}
          </div>
          {formData.totalWeight && <p className="mt-3 text-sm"><strong>Total Weight:</strong> {formData.totalWeight}</p>}
        </div>

        {/* Delivery Information Summary */}
        <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
          <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-4">Delivery Details</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Destination Charity:</strong> {formData.preferredCharity}</p>
            <p><strong>Delivery Address:</strong> {formData.deliveryAddress}</p>
            {formData.deliveryInstructions && <p><strong>Instructions:</strong> {formData.deliveryInstructions}</p>}
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-6">
        <h3 className="text-lg font-semibold text-ghibli-dark-blue mb-4">Additional Information</h3>
        <div>
          <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.additionalNotes}
            onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
            className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
            placeholder="Any additional information for the volunteer"
            rows="3"
          />
        </div>

        <div className="mt-4 space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.photoConsent}
              onChange={(e) => handleInputChange('photoConsent', e.target.checked)}
              className="w-4 h-4 text-ghibli-teal bg-gray-100 border-gray-300 rounded focus:ring-ghibli-teal"
            />
            <span className="ml-2 text-sm text-ghibli-dark-blue">
              I consent to photos being taken of the donation for documentation purposes
            </span>
          </label>

          <div>
            <label className="block text-sm font-medium text-ghibli-dark-blue mb-2">
              Preferred Contact Method
            </label>
            <select
              value={formData.contactPreference}
              onChange={(e) => handleInputChange('contactPreference', e.target.value)}
              className="w-full px-4 py-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-transparent"
            >
              <option value="phone">Phone call</option>
              <option value="sms">SMS/Text message</option>
              <option value="email">Email</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-20 h-20 bg-ghibli-green rounded-full flex items-center justify-center">
        <CheckCircleIcon className="h-12 w-12 text-white" />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-ghibli-dark-blue handwritten mb-4">
          Donation Submitted Successfully! 🎉
        </h2>
        <p className="text-lg text-ghibli-brown mb-6">
          Thank you for your generous donation! Your request has been submitted and volunteers in your area will be notified.
        </p>
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
        <button
          onClick={() => {
            setCurrentStep(1);
            setSubmissionSuccess(false);
            setFormData({
              donorName: '',
              donorPhone: '',
              donorEmail: '',
              organizationName: '',
              organizationType: 'individual',
              pickupAddress: '',
              pickupCoordinates: null,
              pickupInstructions: '',
              accessNotes: '',
              donationItems: [{ category: '', description: '', quantity: '', condition: 'good' }],
              totalWeight: '',
              requiresRefrigeration: false,
              fragileItems: false,
              deliveryAddress: '',
              deliveryCoordinates: null,
              preferredCharity: '',
              preferredCharityId: '',
              deliveryInstructions: '',
              availabilityType: 'flexible',
              preferredDate: '',
              preferredTimeStart: '',
              preferredTimeEnd: '',
              urgencyLevel: 'medium',
              additionalNotes: '',
              photoConsent: false,
              contactPreference: 'phone'
            });
          }}
          className="px-6 py-3 bg-ghibli-teal text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          Submit Another Donation
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-ghibli-brown text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );

  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-ghibli-cream py-8">
        <div className="max-w-4xl mx-auto px-4">
          {renderSuccessStep()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ghibli-cream py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-ghibli-dark-blue handwritten mb-2">
            Submit a Donation 🎁
          </h1>
          <p className="text-lg text-ghibli-brown">
            Help us connect your generous donation with those who need it most
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-ghibli border border-ghibli-brown-light p-8 mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-ghibli-brown-light text-ghibli-brown cursor-not-allowed'
                : 'bg-ghibli-brown text-white hover:bg-opacity-90'
            }`}
          >
            Previous
          </button>

          <div className="text-sm text-ghibli-brown">
            Step {currentStep} of 4
          </div>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                validateStep(currentStep)
                  ? 'bg-ghibli-teal text-white hover:bg-opacity-90'
                  : 'bg-ghibli-brown-light text-ghibli-brown cursor-not-allowed'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-ghibli-green text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <TruckIcon className="h-5 w-5" />
                  <span>Submit Donation</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-ghibli-blue bg-opacity-10 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="h-6 w-6 text-ghibli-blue mt-1" />
            <div>
              <h3 className="font-semibold text-ghibli-dark-blue mb-2">Need Help?</h3>
              <p className="text-sm text-ghibli-brown mb-2">
                If you have questions about the donation process or need assistance, please contact us:
              </p>
              <div className="text-sm text-ghibli-brown space-y-1">
                <p>📞 Phone: +254 700 123 456</p>
                <p>📧 Email: donations@genhands.org</p>
                <p>🕒 Available: Monday - Friday, 8:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSubmission;
