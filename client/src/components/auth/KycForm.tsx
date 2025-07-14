import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { KycData } from '@/types/auth';

interface KycFormProps {
  onSuccess?: () => void;
}

function KycForm({ onSuccess }: KycFormProps) {
  const { submitKyc, loading } = useAuth();
  const [formData, setFormData] = useState<Partial<KycData>>({
    idType: 'national_id',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitKyc(formData as KycData);
      onSuccess?.();
    } catch {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Complete Your KYC Verification
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Type
          </label>
          <select
            name="idType"
            value={formData.idType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="national_id">National ID</option>
            <option value="drivers_license">Driver's License</option>
            <option value="passport">Passport</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Number
          </label>
          <input
            type="text"
            name="idNumber"
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Front Image
            </label>
            <input
              type="file"
              name="idFrontImage"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Back Image
            </label>
            <input
              type="file"
              name="idBackImage"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selfie
          </label>
          <input
            type="file"
            name="selfieImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Please take a clear photo of yourself holding your ID
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit KYC'}
        </button>
      </form>
    </div>
  );
}

export default KycForm;
