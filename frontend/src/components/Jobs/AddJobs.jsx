import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { newJobAction } from '../../redux/slices/Jobs/jobSlices';
import { FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import LoadingComponent from '../Alert/LoadingComponent';
import SuccessMsg from '../Alert/SuccessMsg';
import ErrorMsg from '../Alert/ErrorMsg';
const AddJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error,success } = useSelector((state) => state?.jobs);
  console.log(loading);
  console.log(error);
  console.log(success);

  // Initial form state
  const initialState = {
    title: '',
    company: '',
    location: '',
    employmentType: 'Full-time',
    salaryRange: { min: '', max: '' },
    requirements: [''],
    responsibilities: [''],
    qualifications: [''],
    applicationDeadline: '',
    applicationLink: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState({});

  // ... [Keep all your existing handler functions unchanged] ...

   // Handle input changes
   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle salary range changes
  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      salaryRange: {
        ...formData.salaryRange,
        [name]: value,
      },
    });
  };

  // Handle array field changes (requirements, responsibilities, qualifications)
  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData({
      ...formData,
      [field]: updatedArray,
    });
  };

  // Add new item to array field
  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  // Remove item from array field
  const removeArrayItem = (field, index) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: updatedArray,
    });
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.company.trim()) errors.company = 'Company is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.employmentType) errors.employmentType = 'Employment type is required';
    if (!formData.applicationDeadline) errors.applicationDeadline = 'Deadline is required';
    
    // Validate array fields have at least one non-empty item
    ['requirements', 'responsibilities', 'qualifications'].forEach(field => {
      if (!formData[field].some(item => item.trim())) {
        errors[field] = `At least one ${field} is required`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Clean up empty strings from arrays
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(item => item.trim()),
        responsibilities: formData.responsibilities.filter(item => item.trim()),
        qualifications: formData.qualifications.filter(item => item.trim()),
      };
      console.log(cleanedData);

      

      dispatch(newJobAction(cleanedData))
        .unwrap()
        .then(() => {

          navigate('/jobs'); // Redirect after successful submission
        })
        .catch((err) => {
          console.error('Job posting failed:', err);
        });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Header with back button */}
          <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/jobs')}
              className="flex items-center text-white hover:text-indigo-200 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Jobs
            </button>
            <h2 className="text-2xl font-bold text-white">Post a New Job</h2>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>

          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
             {/* {success && <SuccessMsg message="Job Created Successfully!" />} */}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${formErrors.title ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g. Senior React Developer"
                    />
                    {formErrors.title && <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${formErrors.company ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g. Tech Corp Inc."
                    />
                    {formErrors.company && <p className="mt-1 text-sm text-red-600">{formErrors.company}</p>}
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${formErrors.location ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g. San Francisco, CA or Remote"
                    />
                    {formErrors.location && <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>}
                  </div>

                  {/* Employment Type */}
                  <div>
                    <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                      Employment Type<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="employmentType"
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${formErrors.employmentType ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                    </select>
                    {formErrors.employmentType && <p className="mt-1 text-sm text-red-600">{formErrors.employmentType}</p>}
                  </div>
                </div>
              </div>

              {/* Salary Range */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
                  Salary Range (optional)
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Salary
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        id="salaryMin"
                        name="min"
                        value={formData.salaryRange.min}
                        onChange={handleSalaryChange}
                        className="w-full pl-8 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="e.g. 50000"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Salary
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        id="salaryMax"
                        name="max"
                        value={formData.salaryRange.max}
                        onChange={handleSalaryChange}
                        className="w-full pl-8 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="e.g. 80000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
                  Requirements<span className="text-red-500">*</span>
                </h3>
                <div className="space-y-3">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={req}
                          onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${index === 0 && formErrors.requirements ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder={`Requirement ${index + 1}`}
                        />
                      </div>
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('requirements', index)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                          title="Remove requirement"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                  {formErrors.requirements && <p className="mt-1 text-sm text-red-600">{formErrors.requirements}</p>}
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="mt-2 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <FiPlus className="mr-1" />
                    Add Requirement
                  </button>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">4</span>
                  Responsibilities<span className="text-red-500">*</span>
                </h3>
                <div className="space-y-3">
                  {formData.responsibilities.map((resp, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={resp}
                          onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${index === 0 && formErrors.responsibilities ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder={`Responsibility ${index + 1}`}
                        />
                      </div>
                      {formData.responsibilities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('responsibilities', index)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                          title="Remove responsibility"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                  {formErrors.responsibilities && <p className="mt-1 text-sm text-red-600">{formErrors.responsibilities}</p>}
                  <button
                    type="button"
                    onClick={() => addArrayItem('responsibilities')}
                    className="mt-2 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <FiPlus className="mr-1" />
                    Add Responsibility
                  </button>
                </div>
              </div>

              {/* Qualifications */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">5</span>
                  Qualifications<span className="text-red-500">*</span>
                </h3>
                <div className="space-y-3">
                  {formData.qualifications.map((qual, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={qual}
                          onChange={(e) => handleArrayChange('qualifications', index, e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${index === 0 && formErrors.qualifications ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder={`Qualification ${index + 1}`}
                        />
                      </div>
                      {formData.qualifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('qualifications', index)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                          title="Remove qualification"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                  {formErrors.qualifications && <p className="mt-1 text-sm text-red-600">{formErrors.qualifications}</p>}
                  <button
                    type="button"
                    onClick={() => addArrayItem('qualifications')}
                    className="mt-2 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <FiPlus className="mr-1" />
                    Add Qualification
                  </button>
                </div>
              </div>

              {/* Application Details */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full flex items-center justify-center mr-3">6</span>
                  Application Details
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {/* Application Deadline */}
                  <div>
                    <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                      Application Deadline<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="applicationDeadline"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${formErrors.applicationDeadline ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {formErrors.applicationDeadline && <p className="mt-1 text-sm text-red-600">{formErrors.applicationDeadline}</p>}
                  </div>

                  {/* Application Link */}
                  <div>
                    <label htmlFor="applicationLink" className="block text-sm font-medium text-gray-700 mb-1">
                      Application Link (optional)
                    </label>
                    <input
                      type="url"
                      id="applicationLink"
                      name="applicationLink"
                      value={formData.applicationLink}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="https://example.com/apply"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/jobs')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting...
                    </>
                  ) : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddJob;