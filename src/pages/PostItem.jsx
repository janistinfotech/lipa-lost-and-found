import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Gift, 
  MapPin, 
  Calendar, 
  Tag, 
  FileText, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ITEM_CATEGORIES, LIPA_BARANGAYS } from '../utils/constants';
import { createItemReport, getFriendlyFirestoreErrorMessage } from '../services/itemService';
import './PostItem.css';

const PostItem = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  // Get today's date in YYYY-MM-DD format for max date validation
  const todayStr = new Date().toISOString().split('T')[0];

  // Form State
  const [formData, setFormData] = useState({
    type: 'lost', // 'lost' | 'found'
    itemName: '',
    category: '',
    barangay: '',
    location: '',
    eventDate: todayStr,
    description: '',
    contactInfo: ''
  });

  // UI State
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field-specific error upon typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  // Handle Type Switch (Lost vs Found)
  const handleTypeSelect = (selectedType) => {
    setFormData(prev => ({ ...prev, type: selectedType }));
    if (fieldErrors.type) {
      setFieldErrors(prev => ({ ...prev, type: '' }));
    }
  };

  // Validate Form Inputs
  const validateForm = () => {
    const errors = {};

    // 1. Report Type
    if (!formData.type || !['lost', 'found'].includes(formData.type)) {
      errors.type = 'Please select whether the item is Lost or Found.';
    }

    // 2. Item Name
    const trimmedName = formData.itemName.trim();
    if (!trimmedName) {
      errors.itemName = 'Item name is required.';
    } else if (trimmedName.length > 100) {
      errors.itemName = 'Item name cannot exceed 100 characters.';
    }

    // 3. Category
    if (!formData.category) {
      errors.category = 'Please select a category.';
    }

    // 4. Barangay
    if (!formData.barangay) {
      errors.barangay = 'Please select a Lipa City barangay.';
    }

    // 5. Specific Location
    const trimmedLocation = formData.location.trim();
    if (!trimmedLocation) {
      errors.location = 'Specific location is required.';
    } else if (trimmedLocation.length > 200) {
      errors.location = 'Location description cannot exceed 200 characters.';
    }

    // 6. Event Date
    if (!formData.eventDate) {
      errors.eventDate = 'Event date is required.';
    } else if (formData.eventDate > todayStr) {
      errors.eventDate = 'Event date cannot be in the future.';
    }

    // 7. Description
    const trimmedDesc = formData.description.trim();
    if (!trimmedDesc) {
      errors.description = 'Description is required to help identify the item.';
    } else if (trimmedDesc.length > 1000) {
      errors.description = 'Description cannot exceed 1000 characters.';
    }

    // 8. Contact Information (Optional)
    const trimmedContact = formData.contactInfo.trim();
    if (trimmedContact.length > 150) {
      errors.contactInfo = 'Contact information cannot exceed 150 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    if (!currentUser) {
      setGeneralError('You must be logged in to submit a report.');
      return;
    }

    setSubmitting(true);

    try {
      const posterName = currentUser.displayName || userProfile?.fullName || 'Resident';

      await createItemReport({
        userId: currentUser.uid,
        posterName,
        type: formData.type,
        itemName: formData.itemName,
        category: formData.category,
        barangay: formData.barangay,
        location: formData.location,
        eventDate: formData.eventDate,
        description: formData.description,
        contactInfo: formData.contactInfo
      });

      const message = formData.type === 'lost'
        ? 'Your lost item report has been posted successfully.'
        : 'Your found item report has been posted successfully.';

      setSuccessMessage(message);

      // Redirect to /my-posts after a brief feedback delay
      setTimeout(() => {
        navigate('/my-posts', { replace: true });
      }, 1500);

    } catch (err) {
      console.error('[PostItem Error]:', err);
      setGeneralError(getFriendlyFirestoreErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div className="post-item-page container">
      <div className="post-item-header">
        <div className="post-badge-row">
          <span className="badge badge-teal">
            <Sparkles size={13} />
            <span>Community Report</span>
          </span>
          <span className="badge badge-sky">Lipa City Directory</span>
        </div>
        <h1 className="post-title">Report a Lost or Found Item</h1>
        <p className="post-subtitle">
          Help the Lipa City community reconnect people with their belongings.
        </p>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="post-banner-success" role="alert">
          <CheckCircle2 size={24} className="banner-success-icon" />
          <div className="banner-text">
            <h4 className="banner-title">Report Submitted!</h4>
            <p className="banner-desc">{successMessage} Redirecting to your posts...</p>
          </div>
        </div>
      )}

      {/* Error Notification Banner */}
      {generalError && (
        <div className="post-banner-error" role="alert">
          <AlertCircle size={22} className="banner-error-icon" />
          <div className="banner-text">
            <h4 className="banner-title">Submission Error</h4>
            <p className="banner-desc">{generalError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="post-form" noValidate>
        {/* SECTION 1: What happened? (Type Selector) */}
        <div className="form-card card">
          <div className="card-section-header">
            <span className="section-number-pill">1</span>
            <div>
              <h2 className="card-section-title">What Happened?</h2>
              <p className="card-section-desc">Select whether you are reporting a misplaced or discovered item.</p>
            </div>
          </div>

          <div className="type-selector-grid">
            {/* Lost Card Option */}
            <button
              type="button"
              className={`type-option-card lost-option ${formData.type === 'lost' ? 'selected' : ''}`}
              onClick={() => handleTypeSelect('lost')}
              disabled={submitting}
            >
              <div className="type-icon-circle lost">
                <Search size={24} />
              </div>
              <div className="type-info">
                <span className="type-title">I Lost an Item</span>
                <span className="type-caption">You misplaced a personal belonging in Lipa City</span>
              </div>
              <div className="type-radio-indicator">
                <div className="radio-inner"></div>
              </div>
            </button>

            {/* Found Card Option */}
            <button
              type="button"
              className={`type-option-card found-option ${formData.type === 'found' ? 'selected' : ''}`}
              onClick={() => handleTypeSelect('found')}
              disabled={submitting}
            >
              <div className="type-icon-circle found">
                <Gift size={24} />
              </div>
              <div className="type-info">
                <span className="type-title">I Found an Item</span>
                <span className="type-caption">You found an item and want to reconnect it with the owner</span>
              </div>
              <div className="type-radio-indicator">
                <div className="radio-inner"></div>
              </div>
            </button>
          </div>
          {fieldErrors.type && <span className="field-error-text">{fieldErrors.type}</span>}
        </div>

        {/* SECTION 2: Item Details */}
        <div className="form-card card">
          <div className="card-section-header">
            <span className="section-number-pill">2</span>
            <div>
              <h2 className="card-section-title">Item Details</h2>
              <p className="card-section-desc">Provide descriptive specifications of the belonging.</p>
            </div>
          </div>

          <div className="form-row-2col">
            {/* Item Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="itemName">
                Item Name <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <FileText size={18} className="input-icon" />
                <input
                  id="itemName"
                  name="itemName"
                  type="text"
                  maxLength={100}
                  className={`form-input ${fieldErrors.itemName ? 'input-error' : ''}`}
                  placeholder="e.g., Black Leather Wallet with School ID"
                  value={formData.itemName}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />
              </div>
              <div className="field-footer">
                {fieldErrors.itemName ? (
                  <span className="field-error-text">{fieldErrors.itemName}</span>
                ) : (
                  <span className="field-helper-text">Specific, clear title</span>
                )}
                <span className="char-counter">{formData.itemName.length}/100</span>
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <Tag size={18} className="input-icon" />
                <select
                  id="category"
                  name="category"
                  className={`form-input form-select ${fieldErrors.category ? 'input-error' : ''}`}
                  value={formData.category}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                >
                  <option value="">-- Select a Category --</option>
                  {ITEM_CATEGORIES.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              {fieldErrors.category && (
                <span className="field-error-text">{fieldErrors.category}</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Detailed Description <span className="required-star">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              maxLength={1000}
              className={`form-input form-textarea ${fieldErrors.description ? 'input-error' : ''}`}
              placeholder="Provide distinctive details: color, brand, unique markings, model, contents, or circumstances..."
              value={formData.description}
              onChange={handleChange}
              disabled={submitting}
              required
            />
            <div className="field-footer">
              {fieldErrors.description ? (
                <span className="field-error-text">{fieldErrors.description}</span>
              ) : (
                <span className="field-helper-text">Do not share sensitive confidential pin numbers or security codes</span>
              )}
              <span className="char-counter">{formData.description.length}/1000</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: Where and When? */}
        <div className="form-card card">
          <div className="card-section-header">
            <span className="section-number-pill">3</span>
            <div>
              <h2 className="card-section-title">Where &amp; When?</h2>
              <p className="card-section-desc">Pinpoint the Lipa City location and date of the occurrence.</p>
            </div>
          </div>

          <div className="form-row-3col">
            {/* Barangay */}
            <div className="form-group">
              <label className="form-label" htmlFor="barangay">
                Barangay <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <MapPin size={18} className="input-icon" />
                <select
                  id="barangay"
                  name="barangay"
                  className={`form-input form-select ${fieldErrors.barangay ? 'input-error' : ''}`}
                  value={formData.barangay}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                >
                  <option value="">-- Select Barangay --</option>
                  {LIPA_BARANGAYS.map((brgy, idx) => (
                    <option key={idx} value={brgy}>{brgy}</option>
                  ))}
                </select>
              </div>
              {fieldErrors.barangay && (
                <span className="field-error-text">{fieldErrors.barangay}</span>
              )}
            </div>

            {/* Specific Location */}
            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Specific Location <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <MapPin size={18} className="input-icon" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  maxLength={200}
                  className={`form-input ${fieldErrors.location ? 'input-error' : ''}`}
                  placeholder="e.g., Near SM City Lipa main entrance"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />
              </div>
              <div className="field-footer">
                {fieldErrors.location ? (
                  <span className="field-error-text">{fieldErrors.location}</span>
                ) : (
                  <span className="field-helper-text">Landmark or establishment</span>
                )}
                <span className="char-counter">{formData.location.length}/200</span>
              </div>
            </div>

            {/* Event Date (Dynamic Label) */}
            <div className="form-group">
              <label className="form-label" htmlFor="eventDate">
                {formData.type === 'lost' ? 'Date Lost' : 'Date Found'} <span className="required-star">*</span>
              </label>
              <div className="input-with-icon">
                <Calendar size={18} className="input-icon" />
                <input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  max={todayStr}
                  className={`form-input ${fieldErrors.eventDate ? 'input-error' : ''}`}
                  value={formData.eventDate}
                  onChange={handleChange}
                  disabled={submitting}
                  required
                />
              </div>
              {fieldErrors.eventDate && (
                <span className="field-error-text">{fieldErrors.eventDate}</span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: Contact Details (Optional) */}
        <div className="form-card card">
          <div className="card-section-header">
            <span className="section-number-pill">4</span>
            <div>
              <h2 className="card-section-title">Contact Preferences</h2>
              <p className="card-section-desc">Optional contact method for claimants or finders to reach you.</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contactInfo">
              Contact Information <span className="optional-tag">(Optional)</span>
            </label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" />
              <input
                id="contactInfo"
                name="contactInfo"
                type="text"
                maxLength={150}
                className={`form-input ${fieldErrors.contactInfo ? 'input-error' : ''}`}
                placeholder="e.g., Mobile (0917-xxx-xxxx) or Facebook Messenger link"
                value={formData.contactInfo}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
            <div className="field-footer">
              {fieldErrors.contactInfo ? (
                <span className="field-error-text">{fieldErrors.contactInfo}</span>
              ) : (
                <span className="field-helper-text">
                  Your primary registered email ({currentUser?.email}) is associated with this post.
                </span>
              )}
              <span className="char-counter">{formData.contactInfo.length}/150</span>
            </div>
          </div>
        </div>

        {/* Form Submission Actions */}
        <div className="form-actions-bar">
          <button
            type="submit"
            className={`btn btn-lg form-submit-btn ${formData.type === 'lost' ? 'btn-lost-submit' : 'btn-found-submit'}`}
            disabled={submitting || !!successMessage}
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="auth-spinner" />
                <span>Posting Report to Lipa Directory...</span>
              </>
            ) : (
              <>
                {formData.type === 'lost' ? <Search size={20} /> : <Gift size={20} />}
                <span>{formData.type === 'lost' ? 'Publish Lost Item Report' : 'Publish Found Item Report'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostItem;
