import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AppContext from '@/Context/AppContext.jsx';

const Profile = () => {
  const { user, fetchUser, updateUser, fetchImage, removeImage } = React.useContext(AppContext);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', image: null });
  const [hovered, setHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeData = async () => {
      if (isInitialized) return;
      setIsLoading(true);
      try {
        await fetchUser();
        const imageData = await fetchImage();
        setFormData((prev) => ({
          ...prev,
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          image: imageData ? `data:image/jpeg;base64,${imageData}` : null,
        }));
      } catch {
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    initializeData();
  }, [fetchUser, fetchImage, isInitialized, user]);

  const getInitial = useMemo(() => {
    return formData.firstName?.charAt(0).toUpperCase() || user?.firstName?.charAt(0).toUpperCase() || 'U';
  }, [formData.firstName, user]);

  const imageSrc = useMemo(() => {
    if (!formData.image) return null;
    return formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image;
  }, [formData.image]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image size must be less than 5MB' }));
      return;
    }
    setFormData((prev) => ({ ...prev, image: file }));
    setErrors((prev) => ({ ...prev, image: '' }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (formData.firstName && formData.firstName.length < 2) newErrors.firstName = 'First name must be at least 2 characters';
    if (formData.lastName && formData.lastName.length < 2) newErrors.lastName = 'Last name must be at least 2 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const hasChanges = formData.firstName || formData.lastName || formData.image;
      if (!hasChanges) {
        toast.info('Please provide at least one field to update');
        return;
      }

      setIsLoading(true);
      try {
        const updatedUser = await updateUser(
          formData.firstName || user?.firstName,
          formData.lastName || user?.lastName,
          formData.image instanceof File ? formData.image : null
        );
        if (updatedUser) {
          setFormData({
            firstName: updatedUser.firstName || '',
            lastName: updatedUser.lastName || '',
            image: null,
          });
          const imageData = await fetchImage();
          if (imageData) {
            setFormData((prev) => ({ ...prev, image: `data:image/jpeg;base64,${imageData}` }));
          }
          toast.success('Profile updated successfully');
          navigate('/chat');
        }
      } catch {
        toast.error('Failed to update profile');
      } finally {
        setIsLoading(false);
      }
    },
    [formData, user, updateUser, fetchImage, validateForm, navigate]
  );

  const handleImageRemove = useCallback(async () => {
    setIsLoading(true);
    try {
      const success = await removeImage();
      if (success) {
        setFormData((prev) => ({ ...prev, image: null }));
        toast.success('Profile picture removed successfully');
      } else {
        toast.error('Failed to remove profile picture');
      }
    } catch {
      toast.error('Failed to remove profile picture');
    } finally {
      setIsLoading(false);
    }
  }, [removeImage]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20 animate-pulse">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-gray-900 border border-indigo-500/20 rounded-xl p-6 
          shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all duration-500 
          hover:-translate-y-1"
        style={{ transform: 'perspective(1000px)', transformStyle: 'preserve-3d' }}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl z-20">
            <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="relative w-32 h-32 mb-4 group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-indigo-500/30 shadow-inner 
              transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Profile"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 
                    group-hover:rotate-3"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-extrabold drop-shadow-md">{getInitial}</span>
                </div>
              )}
            </div>
            <label
              className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer transition-opacity duration-300 
                opacity-0 group-hover:opacity-100"
            >
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
              />
            </label>
          </div>
          {errors.image && <p className="text-red-400 text-xs font-medium">{errors.image}</p>}
          <p className="text-xs text-indigo-300/80 italic">Click to update your avatar</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-indigo-200 tracking-wide">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="mt-2 w-full px-4 py-2.5 bg-gray-800/50 border border-indigo-500/30 rounded-lg text-gray-100 
                placeholder-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 
                transition-all duration-300 disabled:bg-gray-700/50 disabled:text-gray-400"
              placeholder="Your first node"
              disabled={isLoading}
            />
            {errors.firstName && <p className="text-red-400 text-xs mt-1 font-medium">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-indigo-200 tracking-wide">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="mt-2 w-full px-4 py-2.5 bg-gray-800/50 border border-indigo-500/30 rounded-lg text-gray-100 
                placeholder-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 
                transition-all duration-300 disabled:bg-gray-700/50 disabled:text-gray-400"
              placeholder="Your last block"
              disabled={isLoading}
            />
            {errors.lastName && <p className="text-red-400 text-xs mt-1 font-medium">{errors.lastName}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold
                hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-500/50 disabled:to-purple-500/50 
                disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_10px_rgba(79,70,229,0.5)]"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleImageRemove}
              className="flex-1 py-2.5 bg-gray-700/80 text-indigo-200 rounded-lg text-sm font-semibold
                hover:bg-gray-600 hover:text-white disabled:bg-gray-600/50 disabled:text-gray-500 disabled:cursor-not-allowed 
                transition-all duration-300 hover:shadow-[0_0_10px_rgba(107,114,128,0.3)]"
              disabled={isLoading || !imageSrc}
            >
              Clear Avatar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;