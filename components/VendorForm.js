import React, { useState, useRef } from 'react';

const VendorForm = () => {
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorDescription: '',
    businessType: '',
    vendorAddress: '',
    vendorCity: '',
    vendorContactInfo: '',
    vendorLogo: null,
    vendorWebsite: '',
    taxInfo: '',
    departments: Array(3).fill({ name: '', email: '', phone: '' }),
  });
  const [showAlert, setShowAlert] = useState(false);
  const [popupImage, setPopupImage] = useState(null);

  // Ref for file input
  const fileInputRef = useRef(null);

  // Handle form field changes
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle department field changes
  const handleDepartmentChange = (index, field, value) =>
    setFormData((prev) => ({
      ...prev,
      departments: prev.departments.map((dept, i) => (i === index ? { ...dept, [field]: value } : dept)),
    }));

  // Handle file upload
  const handleFileUpload = (e) => setFormData({ ...formData, vendorLogo: e.target.files[0] });

  // Handle image removal
  const handleRemoveImage = () => {
    setFormData({ ...formData, vendorLogo: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) return; // Prevent submission if form is invalid
    console.log('Form Data Submitted:', formData);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Validation Functions
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\d{10}$/.test(phone.replace(/[-\s()]/g, '')); // Allows 10 digits, ignores formatting

  // Check if all required fields are filled and valid
  const isFormValid = () => {
    const { vendorName, vendorDescription, businessType, vendorAddress, vendorCity, vendorContactInfo, departments } =
      formData;

    // Validate main contact info
    if (!isValidPhone(vendorContactInfo)) return false;

    // Validate departments
    const areDepartmentsValid = departments.every(
      (dept) => dept.name.trim() !== '' && isValidEmail(dept.email) && isValidPhone(dept.phone)
    );

    return (
      vendorName.trim() !== '' &&
      vendorDescription.trim() !== '' &&
      businessType.trim() !== '' &&
      vendorAddress.trim() !== '' &&
      vendorCity.trim() !== '' &&
      isValidPhone(vendorContactInfo) &&
      areDepartmentsValid
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-xl border border-gray-200 animate-fade-in">
        <h2 className="text-center text-3xl font-extrabold text-indigo-700 mb-6">Vendor Information</h2>

        {/* Vendor Details Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-indigo-700 mb-4">Vendor Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <InputField
                label="Vendor Name"
                name="vendorName"
                placeholder="Enter vendor name"
                value={formData.vendorName}
                onChange={handleChange}
                required
              />
              <TextAreaField
                label="Vendor Description"
                name="vendorDescription"
                placeholder="Describe your vendor"
                value={formData.vendorDescription}
                onChange={handleChange}
                required
              />
              <SelectField
                label="Business Type"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                options={['Wholesaler', 'Retailer', 'Distributor', 'Manufacturer']}
                required
              />
              <InputField
                label="Vendor Address"
                name="vendorAddress"
                placeholder="Enter address"
                value={formData.vendorAddress}
                onChange={handleChange}
                required
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <InputField
                label="Vendor City"
                name="vendorCity"
                placeholder="Enter city"
                value={formData.vendorCity}
                onChange={handleChange}
                required
              />
              <InputField
                label="Vendor Contact Info"
                name="vendorContactInfo"
                placeholder="Enter contact info"
                value={formData.vendorContactInfo}
                onChange={handleChange}
                required
                error={!isValidPhone(formData.vendorContactInfo) && formData.vendorContactInfo.trim() !== ''}
                helperText={!isValidPhone(formData.vendorContactInfo) && formData.vendorContactInfo.trim() !== '' ? 'Invalid phone number' : ''}
              />
              <InputField
                label="Vendor Website"
                name="vendorWebsite"
                placeholder="Enter website URL"
                value={formData.vendorWebsite}
                onChange={handleChange}
                type="url"
              />
              <InputField
                label="Tax Info"
                name="taxInfo"
                placeholder="Enter tax information"
                value={formData.taxInfo}
                onChange={handleChange}
              />

              {/* Vendor Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Vendor Logo</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-indigo-50 file:hover:bg-indigo-100 file:rounded-full transition duration-300 ease-in-out"
                />
                {formData.vendorLogo && (
                  <div className="mt-2 relative inline-block">
                    <img
                      src={URL.createObjectURL(formData.vendorLogo)}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-md cursor-pointer"
                      onClick={() => setPopupImage(URL.createObjectURL(formData.vendorLogo))}
                    />
                    <div
                      className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-red-600 hover:text-red-800 cursor-pointer transition duration-300 ease-in-out bg-white border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center"
                      onClick={handleRemoveImage}
                    >
                      ×
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Departments Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-indigo-700 mb-4">Departments</h3>
          {formData.departments.map((dept, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <InputField
                label="Name"
                placeholder="Enter department name"
                value={dept.name}
                onChange={(e) => handleDepartmentChange(index, 'name', e.target.value)}
                required
              />
              <InputField
                label="Email"
                placeholder="Enter email"
                value={dept.email}
                onChange={(e) => handleDepartmentChange(index, 'email', e.target.value)}
                type="email"
                required
                error={!isValidEmail(dept.email) && dept.email.trim() !== ''}
                helperText={!isValidEmail(dept.email) && dept.email.trim() !== '' ? 'Invalid email address' : ''}
              />
              <InputField
                label="Phone"
                placeholder="Enter phone number"
                value={dept.phone}
                onChange={(e) => handleDepartmentChange(index, 'phone', e.target.value)}
                type="tel"
                required
                error={!isValidPhone(dept.phone) && dept.phone.trim() !== ''}
                helperText={!isValidPhone(dept.phone) && dept.phone.trim() !== '' ? 'Invalid phone number' : ''}
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`w-full py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out ${
            isFormValid()
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-800 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit
        </button>

        {/* Success Alert */}
        {showAlert && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md animate-fade-in">
            Vendor information submitted successfully!
          </div>
        )}

        {/* Image Popup */}
        {popupImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto relative max-h-[90vh] overflow-y-auto">
              <div
                className="absolute top-2 right-2 text-gray-600 hover:text-red-600 cursor-pointer transition duration-300 ease-in-out"
                onClick={() => setPopupImage(null)}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
              <img src={popupImage} alt="Popup Preview" className="w-full h-auto max-h-[70vh] object-contain rounded-md" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({ label, name, value, onChange, type = 'text', required = false, placeholder = '', error = false, helperText = '' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300 ease-in-out`}
    />
    {helperText && <p className="mt-1 text-sm text-red-500">{helperText}</p>}
  </div>
);

// Reusable Textarea Field Component
const TextAreaField = ({ label, name, value, onChange, required = false, placeholder = '' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      rows={4}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300 ease-in-out"
    ></textarea>
  </div>
);

// Reusable Select Field Component
const SelectField = ({ label, name, value, onChange, options, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300 ease-in-out"
    >
      <option value="">Select Type</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default VendorForm;