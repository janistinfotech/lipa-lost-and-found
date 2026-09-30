import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
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
  ShieldAlert, 
  Sparkles,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ITEM_CATEGORIES, LIPA_BARANGAYS } from '../utils/constants';
import { getItemById, updateItemReport, getFriendlyFirestoreErrorMessage } from '../services/itemService';
import './EditItem.css';

const EditItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];

  // Loading & Item State
  const [initialLoading, setInitialLoading] = useState(true);
  const [originalItem, setOriginalItem] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: 'lost',
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

  // Fetch item and check ownership on mount
  useEffect(() => {
    const loadItem = async () => {
      setInitialLoading(true);
      setGeneralError('');
      try {
        const data = await getItemById(itemId);
        if (!data) {
          setOriginalItem(null);
          setIsOwner(false);
        } else if (currentUser && data.userId === currentUser.uid) {
          setOriginalItem(data);
          setIsOwner(true);
          setFormData({
            type: data.type || 'lost',
            itemName: data.itemName || '',
            category: data.category || '',
            barangay: data.barangay || '',
            location: data.location || '',
            eventDate: data.eventDate || todayStr,
            description: data.description || '',
            contactInfo: data.contactInfo || ''
          });
        } else {
          setOriginalItem(data);
          setIsOwner(false); // Unauthorized edit attempt
        }
      } catch (err) {
        console.error('[EditItem Load Error]:', err);
        setGeneralError(getFriendlyFirestoreErrorMessage(err, 'load'));
      } finally {
        setInitialLoading(false);
      }
    };

    if (itemId && currentUser) {
      loadItem();
    }
  }, [itemId, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateForm = () => {
    const errors = {};

    const trimmedName = formData.itemName.trim();
    if (!trimmedName) {
      errors.itemName = 'Item name is required.';
    } else if (trimmedName.length > 100) {
      errors.itemName = 'Item name cannot exceed 100 characters.';
    }

    if (!formData.category) {
      errors.category = 'Please select a category.';
    }

    if (!formData.barangay) {
      errors.barangay = 'Please select a Lipa City barangay.';
    }

    const trimmedLocation = formData.location.trim();
    if (!trimmedLocation) {
      errors.location = 'Specific location is required.';
    } else if (trimmedLocation.length > 200) {
      errors.location = 'Location description cannot exceed 200 characters.';
    }

    if (!formData.eventDate) {
      errors.eventDate = 'Event date is required.';
    } else if (formData.eventDate > todayStr) {
      errors.eventDate = 'Event date cannot be in the future.';
    }

    const trimmedDesc = formData.description.trim();
    if (!trimmedDesc) {
      errors.description = 'Description is required.';
    } else if (trimmedDesc.length > 1000) {
      errors.description = 'Description cannot exceed 1000 characters.';
    }

    const trimmedContact = formData.contactInfo.trim();
    if (trimmedContact.length > 150) {
      errors.contactInfo = 'Contact information cannot exceed 150 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    if (!validateForm()) return;
    if (!isOwner) {
      setGeneralError('You do not have permission to update this report.');
      return;
    }

    setSubmitting(true);

    try {
      await updateItemReport(itemId, {
        itemName: formData.itemName,
        category: formData.category,
        barangay: formData.barangay,
        location: formData.location,
        eventDate: formData.eventDate,
        description: formData.description,
        contactInfo: formData.contactInfo
      });

      setSuccessMessage('Report updated successfully.');

      setTimeout(() => {
        navigate('/my-posts', { replace: true });
      }, 1200);

    } catch (err) {
      console.error('[EditItem Submit Error]:', err);
      setGeneralError(getFriendlyFirestoreErrorMessage(err, 'update'));
      setSubmitting(false);
    }
  };

  // 1. Initial Loading State
  if (initialLoading) {
    return (
      <div className="edit-item-page container">
        <div className="edit-state-card card">
          <Loader2 size={36} className="auth-spinner text-teal" />
          <p className="edit-state-text">Loading report for editing...</p>
        </div>
      </div>
    );
  }

  // 2. Report Not Found
  if (!originalItem) {
    return (
      <div className="edit-item-page container">
        <div className="edit-state-card card">
          <AlertCircle size={44} className="text-lost" />
          <h2 className="edit-state-title">Report Not Found</h2>
          <p className="edit-state-desc">
            The requested lost or found item report does not exist or has been removed.
          </p>
          <Link to="/my-posts" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Back to My Reports</span>
          </Link>
        </div>
      </div>
    );
  }

  // 3. Unauthorized Ownership Check
  if (!isOwner) {
    return (
      <div className="edit-item-page container">
        <div className="edit-state-card card">
          <ShieldAlert size={48} className="text-lost" />
          <h2 className="edit-state-title">Access Denied</h2>
          <p className="edit-state-desc">
            You do not have permission to edit this report because it belongs to another resident.
          </p>
          <Link to="/my-posts" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Return to My Reports</span>
          </Link>
        </div>
      </div>
    );
  }

  const isLost = formData.type === 'lost';

  return (
    <div className="edit-item-page container">
      {/* Top Header */}
      <div className="edit-topbar">
        <Link to="/my-posts" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} />
          <span>Back to My Reports</span>
        </Link>
      </div>

      <div className="edit-header">
        <div className="edit-badge-row">
          <span className="badge badge-teal">
            <Sparkles size={13} />
            <span>Edit Mode</span>
          </span>
          <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
            {isLost ? 'LOST ITEM REPORT' : 'FOUND ITEM REPORT'}
          </span>
        </div>
        <h1 className="edit-title">Edit Item Report</h1>
        <p className="edit-subtitle">
          Update the specifications or location details of your posted report.
        </p>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="edit-banner-success" role="alert">
          <CheckCircle2 size={22} className="banner-success-icon" />
          <div>
            <h4 className="banner-title">Changes Saved!</h4>
            <p className="banner-desc">{successMessage} Redirecting to My Reports...</p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {generalError && (
        <div className="edit-banner-error" role="alert">
          <AlertCircle size={22} className="banner-error-icon" />
          <div>
            <h4 className="banner-title">Update Failed</h4>
            <p className="banner-desc">{generalError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-form" noValidate>
        {/* SECTION 1: Report Type (Fixed Badge) */}
        <div className="form-card card">
          <div className="card-section-header">
            <span className="section-number-pill">1</span>
            <div>
              <h2 className="card-section-title">Report Classification</h2>
              <p className="card-section-desc">Report type is fixed to maintain community tracking accuracy.</p>
            </div>
          </div>

          <div className="fixed-type-banner">
            <div className={`fixed-type-icon ${isLost ? 'lost' : 'found'}`}>
              {isLost ? <Search size={22} /> : <Gift size={22} />}
            </div>
            <div className="fixed-type-info">
              <span className="fixed-type-label">Current Classification</span>
              <span className="fixed-type-value">
                {isLost ? 'Lost Item Report' : 'Found Item Report'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Item Details */}
        <div className="form-card card">
          <div className="card-section-header">
            <span className="section-number-pill">2</span>
            <div>
              <h2 className="card-section-title">Item Specifications</h2>
              <p className="card-section-desc">Modify description, category, or title details.</p>
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
                  placeholder="e.g., Black Leather Wallet"
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
                  <span className="field-helper-text">Max 100 characters</span>
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
              placeholder="Provide distinctive markings, contents, or color details..."
              value={formData.description}
              onChange={handleChange}
              disabled={submitting}
              required
            />
            <div className="field-footer">
              {fieldErrors.description ? (
                <span className="field-error-text">{fieldErrors.description}</span>
              ) : (
                <span className="field-helper-text">Keep details clear and accurate</span>
              )}
              <span className="char-counter">{formData.description.length}/1000</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: Location & Date */}
        <div className="form-card card">
          <div className="card-section-header">
            <span className="section-number-pill">3</span>
            <div>
              <h2 className="card-section-title">Where &amp; When</h2>
              <p className="card-section-desc">Update occurrence location within Lipa City.</p>
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
                  placeholder="e.g., Near Lipa Cathedral"
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
                  <span className="field-helper-text">Landmark or area</span>
                )}
                <span className="char-counter">{formData.location.length}/200</span>
              </div>
            </div>

            {/* Event Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="eventDate">
                {isLost ? 'Date Lost' : 'Date Found'} <span className="required-star">*</span>
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

        {/* SECTION 4: Contact Info */}
        <div className="form-card card">
          <div className="card-section-header">
            <span className="section-number-pill">4</span>
            <div>
              <h2 className="card-section-title">Contact Information</h2>
              <p className="card-section-desc">Optional phone number or preferred contact note.</p>
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
                placeholder="e.g., Mobile (0917-xxx-xxxx)"
                value={formData.contactInfo}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
            <div className="field-footer">
              {fieldErrors.contactInfo ? (
                <span className="field-error-text">{fieldErrors.contactInfo}</span>
              ) : (
                <span className="field-helper-text">Max 150 characters</span>
              )}
              <span className="char-counter">{formData.contactInfo.length}/150</span>
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="edit-actions-bar">
          <Link to="/my-posts" className="btn btn-outline btn-lg">
            <span>Cancel</span>
          </Link>
          <button
            type="submit"
            className="btn btn-primary btn-lg edit-save-btn"
            disabled={submitting || !!successMessage}
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="auth-spinner" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save size={19} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditItem;
