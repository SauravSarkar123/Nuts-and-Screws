import React, { useState } from 'react';
import { useRouter } from 'next/router';

// Sample Category Data
const categoryData = {
  Fasteners: {
    Nuts: {
      'Knurled Check Nuts': null,
      'Acorn Nuts': null,
      'T-Slot Nuts': null,
      'Coupling Nuts': null,
      'Flange Nuts': null,
      'Hex Nuts': null,
    },
    Screws: {
      'Screw Jacks': {
        'Adjustable Locating Buttons': null,
        'Manual Work Supports': null,
        'Through-Hole Leveling Jacks': null,
        'Torque Screw Jacks': null,
      },
    },
  },
};

const CategoryForm = () => {
  const [selectedCategories, setSelectedCategories] = useState({
    level1: '',
    level2: '',
    level3: '',
    level4: '',
    level5: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  // Handle category selection changes
  const handleChange = (level, value) => {
    const updatedCategories = { ...selectedCategories };
    updatedCategories[level] = value;

    // Reset subsequent levels
    if (level === 'level1') {
      updatedCategories.level2 = '';
      updatedCategories.level3 = '';
      updatedCategories.level4 = '';
      updatedCategories.level5 = '';
    } else if (level === 'level2') {
      updatedCategories.level3 = '';
      updatedCategories.level4 = '';
      updatedCategories.level5 = '';
    } else if (level === 'level3') {
      updatedCategories.level4 = '';
      updatedCategories.level5 = '';
    } else if (level === 'level4') {
      updatedCategories.level5 = '';
    }

    setSelectedCategories(updatedCategories);
  };

  // Handle form submission
  const handleSubmit = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      // Redirect to Vendor Form page
      router.push('/vendor-form');
    }, 3000); // Hide alert after 3 seconds and redirect
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        <h2 className="text-center text-3xl font-extrabold text-indigo-700">Category Selection</h2>

        {/* Level 1 */}
        <DropdownField
          label="Category Level 1"
          value={selectedCategories.level1}
          onChange={(value) => handleChange('level1', value)}
          options={Object.keys(categoryData)}
        />

        {/* Level 2 */}
        {selectedCategories.level1 && (
          <DropdownField
            label="Category Level 2"
            value={selectedCategories.level2}
            onChange={(value) => handleChange('level2', value)}
            options={Object.keys(categoryData[selectedCategories.level1] || {})}
          />
        )}

        {/* Level 3 */}
        {selectedCategories.level2 && (
          <DropdownField
            label="Category Level 3"
            value={selectedCategories.level3}
            onChange={(value) => handleChange('level3', value)}
            options={Object.keys(categoryData[selectedCategories.level1]?.[selectedCategories.level2] || {})}
          />
        )}

        {/* Level 4 */}
        {selectedCategories.level3 &&
          categoryData[selectedCategories.level1]?.[selectedCategories.level2]?.[selectedCategories.level3] && (
            <DropdownField
              label="Category Level 4"
              value={selectedCategories.level4}
              onChange={(value) => handleChange('level4', value)}
              options={Object.keys(
                categoryData[selectedCategories.level1]?.[selectedCategories.level2]?.[selectedCategories.level3] || {}
              )}
            />
          )}

        {/* Level 5 */}
        {selectedCategories.level4 &&
          categoryData[selectedCategories.level1]?.[selectedCategories.level2]?.[selectedCategories.level3]?.[
            selectedCategories.level4
          ] && (
            <DropdownField
              label="Category Level 5"
              value={selectedCategories.level5}
              onChange={(value) => handleChange('level5', value)}
              options={Object.keys(
                categoryData[selectedCategories.level1]?.[selectedCategories.level2]?.[selectedCategories.level3]?.[
                  selectedCategories.level4
                ] || {}
              )}
            />
          )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedCategories.level1 || !selectedCategories.level2 || !selectedCategories.level3}
          className="w-full mt-6 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Selection
        </button>

        {/* Success Alert */}
        {showAlert && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md animate-fade-in">
            <p>Category has been selected successfully! Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Dropdown Component
const DropdownField = ({ label, value, onChange, options }) => (
  <div className="animate-fade-in">
    <label htmlFor={label} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-300 ease-in-out"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default CategoryForm;