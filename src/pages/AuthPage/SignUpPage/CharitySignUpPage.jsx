import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CharitySignUpPage = () => {
  const [form, setForm] = useState({
    charityName: '',
    category: '',
    location: '',
    description: '',
    registrationNumber: '',
    email: '',
    phoneNumber: '',
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
    password: ''
  });
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e) => {
    setDocuments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // Append all fields
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    // Append files
    for (let i = 0; i < documents.length; i++) {
      formData.append('documents', documents[i]);
    }
    // Required fields for backend
    formData.append('role', 'charity');
    formData.append('name', `${form.contactFirstName} ${form.contactLastName}`);

    try {
      const res = await fetch('http://localhost:3000/api/auth/register/charity', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Application submitted! Please wait for admin approval.');
        navigate('/auth/signin/signin');
      } else {
        setError(data.message || 'Registration failed');
        toast.error(data.message || 'Registration failed');
      }
    } catch {
      setError('Network error');
      toast.error('Network error');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans px-4 py-10"
      style={{
        background:
          'linear-gradient(90deg, #005AA7, #FFFDE4)',
      }}
    >
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 bg-white border border-black text-black rounded-full p-2 shadow hover:bg-gray-100 transition"
        aria-label="Go back"
      >
        <FiArrowLeft size={20} />
      </button>

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: Image */}
        <div className="hidden md:block h-full">
          <img
            src="https://img.freepik.com/free-photo/volunteers-provide-meal-boxes-canned-goods-needy-individuals-seniors-homeless-people-receive-nourishment-from-smiling-workers-embodying-spirit-food-drive-nonprofit-organization_482257-72986.jpg?ga=GA1.1.1058639554.1749533826&semt=ais_items_boosted&w=740"
            alt="Charity"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-medium text-black mb-4">Sign Up as a Charity</h2>
          <p className="text-gray-600 text-sm mb-6">
            Register your organization and get support for your mission!
          </p>

          <form className="space-y-5" onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization Name</label>
              <input
                type="text"
                name="charityName"
                required value={form.charityName}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                placeholder="Foundation of Light"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Organization Type</label>
              <select
                name="category"
                required value={form.category}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
              >
                <option value="">Select type</option>
                <option value="ngo">Children & Youth</option>
                <option value="cbo">Hunger & Food Aid</option>
                <option value="religious">Emergency Relief</option>
                <option value="foundation">Healthcare & Medical</option>
                <option value="foundation">Poverty & Homelessness</option>
                <option value="foundation">Animals & Wildlife</option>
                <option value="foundation">Elderly & Disabled Care</option>
                <option value="foundation">Community Development</option>
                <option value="foundation">Education & Schools</option>
                <option value="foundation">Environmental Conservation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location" 
                required value={form.location} 
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                placeholder="Muthaiga North Rd, Nairobi, Kenya"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mission Statement</label>
              <textarea
                name="description" 
                required value={form.description} 
                onChange={handleChange} 
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                rows="3"
                placeholder="Our mission is to..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input
                type="text"
                name="registrationNumber" 
                required value={form.registrationNumber} 
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                placeholder="REG-123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email" 
                required value={form.email} 
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                placeholder="contact@charity.org"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber" 
                required value={form.phoneNumber} 
                onChange={handleChange}
                pattern="^\+254[0-9]{9}$"
                minLength={10}
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                placeholder="+254 700 123 456 (without spaces)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Person First Name</label>
                <input
                  type="text"
                  name="contactFirstName" 
                  required value={form.contactFirstName} 
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                  placeholder="William"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Person Last Name</label>
                <input
                  type="text"
                  name="contactLastName" 
                  required value={form.contactLastName} 
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                  placeholder="Odhiambo"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Person's Email</label>
                <input
                  type="email"
                  name="contactEmail" 
                  required value={form.contactEmail} 
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                  placeholder="williamodhiambo8@gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Person's Phone</label>
                <input
                  type="tel"
                  name="contactPhone" 
                  required value={form.contactPhone} 
                  onChange={handleChange}
                  minLength={10}
                  className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                  placeholder="+254 712 345 678 (without spaces)"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                required value={form.password}
                onChange={handleChange}
                minLength={6}
                className="w-full mt-1 px-4 py-2 border border-black rounded-md shadow-sm text-black"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Verification Documents</label>
              <input
                type="file"
                name="documents" 
                multiple required accept=".pdf,.doc,.docx,.jpg,.png" 
                onChange={handleFileChange}
                className="w-full mt-1 border border-black rounded-md px-2 py-1 text-black"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 px-4 hover:brighntess-110 text-white font-semibold rounded-md shadow transition text-black"
              style={{ background: 'linear-gradient(90deg, #005AA7, #FFFDE4)' }}
            >
              Submit Application
            </button>
          </form>

          <p className="text-sm text-center text-black font-thin mt-6">
            Already verified?{' '}
            <span
              onClick={() => navigate('/auth/signin/signin')}
              className="hover:underline cursor-pointer font-medium"
              style={{ color: '#005AA7' }}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharitySignUpPage;
