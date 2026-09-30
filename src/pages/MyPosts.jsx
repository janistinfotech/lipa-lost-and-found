import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderClock, 
  Search, 
  Gift, 
  MapPin, 
  Calendar, 
  Tag, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  Eye, 
  AlertCircle, 
  PlusCircle, 
  Loader2, 
  RotateCw, 
  CheckCheck,
  X,
  Sparkles,
  Layers,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getItemsByUser, 
  markItemResolved, 
  deleteItemReport, 
  getFriendlyFirestoreErrorMessage 
} from '../services/itemService';
import { formatPostedDate, formatEventDate, truncateText } from '../utils/dateUtils';
import './MyPosts.css';

const MyPosts = () => {
  const { currentUser } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Confirmation Modal State for Mark Resolved
  const [resolvingItem, setResolvingItem] = useState(null);
  const [resolvingLoading, setResolvingLoading] = useState(false);

  // Confirmation Modal State for Delete
  const [deletingItem, setDeletingItem] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  // Action Success Banner State
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const fetchUserItems = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError('');
    try {
      const data = await getItemsByUser(currentUser.uid);
      setItems(data);
    } catch (err) {
      console.error('[MyPosts Fetch Error]:', err);
      setError(getFriendlyFirestoreErrorMessage(err, 'load'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserItems();
  }, [currentUser]);

  // Compute summary stats from loaded user posts
  const totalPosts = items.length;
  const activePosts = items.filter(i => (i.status || 'active') === 'active').length;
  const resolvedPosts = items.filter(i => i.status === 'resolved').length;

  // Resolve Modal Handlers
  const handleOpenResolveModal = (item) => {
    setResolvingItem(item);
  };

  const handleCloseResolveModal = () => {
    if (resolvingLoading) return;
    setResolvingItem(null);
  };

  const handleConfirmResolve = async () => {
    if (!resolvingItem) return;

    setResolvingLoading(true);
    try {
      await markItemResolved(resolvingItem.id);

      // Update state locally for instant feedback
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === resolvingItem.id 
            ? { ...item, status: 'resolved' } 
            : item
        )
      );

      const isLost = resolvingItem.type === 'lost';
      setActionSuccessMessage(
        isLost 
          ? `"${resolvingItem.itemName}" has been marked as recovered!`
          : `"${resolvingItem.itemName}" has been marked as returned!`
      );

      handleCloseResolveModal();

      setTimeout(() => {
        setActionSuccessMessage('');
      }, 4000);

    } catch (err) {
      console.error('[Mark Resolved Error]:', err);
      alert('Unable to mark item as resolved. Please try again.');
    } finally {
      setResolvingLoading(false);
    }
  };

  // Delete Modal Handlers
  const handleOpenDeleteModal = (item) => {
    setDeletingItem(item);
  };

  const handleCloseDeleteModal = () => {
    if (deletingLoading) return;
    setDeletingItem(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem || !currentUser) return;

    setDeletingLoading(true);
    try {
      await deleteItemReport(deletingItem.id, currentUser.uid);

      // Remove from local state immediately
      setItems(prevItems => prevItems.filter(item => item.id !== deletingItem.id));

      setActionSuccessMessage('Report deleted successfully.');
      handleCloseDeleteModal();

      setTimeout(() => {
        setActionSuccessMessage('');
      }, 4000);

    } catch (err) {
      console.error('[Delete Error]:', err);
      alert(getFriendlyFirestoreErrorMessage(err, 'delete'));
    } finally {
      setDeletingLoading(false);
    }
  };

  return (
    <div className="my-posts-page container">
      {/* Header Section */}
      <div className="my-posts-header">
        <div className="my-posts-title-group">
          <div className="my-posts-badge-row">
            <span className="badge badge-teal">
              <Sparkles size={13} />
              <span>Owner Dashboard</span>
            </span>
            <span className="badge badge-sky">Resident Submissions</span>
          </div>
          <h1 className="my-posts-title">My Reports</h1>
          <p className="my-posts-subtitle">
            Manage, update, resolve, or delete your lost and found community listings.
          </p>
        </div>

        <Link to="/post-item" className="btn btn-primary my-posts-new-btn">
          <PlusCircle size={18} />
          <span>Post New Report</span>
        </Link>
      </div>

      {/* Action Success Toast Banner */}
      {actionSuccessMessage && (
        <div className="my-posts-toast-success" role="alert">
          <CheckCheck size={20} className="toast-icon text-found" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Summary Stat Cards */}
      {!loading && !error && (
        <div className="my-posts-summary-grid">
          <div className="summary-stat-card card">
            <div className="stat-card-icon total">
              <Layers size={22} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-label">Total Posts</span>
              <span className="stat-card-value">{totalPosts}</span>
            </div>
          </div>

          <div className="summary-stat-card card">
            <div className="stat-card-icon active">
              <CheckCircle2 size={22} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-label">Active Posts</span>
              <span className="stat-card-value">{activePosts}</span>
            </div>
          </div>

          <div className="summary-stat-card card">
            <div className="stat-card-icon resolved">
              <CheckCheck size={22} />
            </div>
            <div className="stat-card-info">
              <span className="stat-card-label">Resolved Posts</span>
              <span className="stat-card-value">{resolvedPosts}</span>
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="my-posts-loading-grid">
          {[1, 2, 3].map(n => (
            <div key={n} className="my-post-skeleton-card card">
              <div className="skeleton-line skeleton-badge"></div>
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-desc"></div>
              <div className="skeleton-box"></div>
              <div className="skeleton-footer"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="my-posts-error-card card">
          <AlertCircle size={40} className="text-lost" />
          <h3 className="error-title">Unable to Load Your Reports</h3>
          <p className="error-desc">{error}</p>
          <button onClick={fetchUserItems} className="btn btn-primary">
            <RotateCw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <div className="my-posts-empty-card card">
          <div className="empty-icon-pill">
            <FolderClock size={42} />
          </div>
          <h2 className="empty-heading">You haven't posted any lost or found items yet.</h2>
          <p className="empty-description">
            When you report a misplaced or discovered item in Lipa City, it will appear here so you can update details, mark it resolved, or delete it.
          </p>
          <Link to="/post-item" className="btn btn-primary btn-lg">
            <PlusCircle size={19} />
            <span>Report an Item</span>
          </Link>
        </div>
      )}

      {/* User's Reports Grid */}
      {!loading && !error && items.length > 0 && (
        <div className="my-posts-items-grid">
          {items.map(item => {
            const isLost = item.type === 'lost';
            const isFound = item.type === 'found';
            const isResolved = item.status === 'resolved';

            return (
              <article key={item.id} className={`my-item-card card ${isLost ? 'type-lost' : 'type-found'} ${isResolved ? 'is-resolved' : ''}`}>
                {/* Top Badges Row */}
                <div className="my-item-topbar">
                  <div className="my-item-badges">
                    {isLost ? (
                      <span className="badge badge-lost">
                        <Search size={12} />
                        <span>LOST</span>
                      </span>
                    ) : (
                      <span className="badge badge-found">
                        <Gift size={12} />
                        <span>FOUND</span>
                      </span>
                    )}

                    {isResolved ? (
                      <span className="badge badge-resolved">
                        <CheckCheck size={12} />
                        <span>{isLost ? 'Recovered' : 'Returned'}</span>
                      </span>
                    ) : (
                      <span className="badge badge-teal">
                        <CheckCircle2 size={12} />
                        <span>Active</span>
                      </span>
                    )}
                  </div>

                  <span className="my-item-post-date" title="Created date">
                    <Clock size={13} />
                    <span>Posted {formatPostedDate(item.createdAt)}</span>
                  </span>
                </div>

                {/* Body Details */}
                <div className="my-item-body">
                  <div className="my-item-category-tag">
                    <Tag size={12} />
                    <span>{item.category || 'General'}</span>
                  </div>

                  <h3 className="my-item-name">{item.itemName}</h3>

                  <p className="my-item-description">
                    {truncateText(item.description, 120)}
                  </p>

                  <div className="my-item-meta-box">
                    <div className="meta-line">
                      <MapPin size={14} className="meta-icon" />
                      <span><strong>{item.barangay}</strong> • {item.location}</span>
                    </div>
                    <div className="meta-line">
                      <Calendar size={14} className="meta-icon" />
                      <span>{isLost ? 'Date Lost:' : 'Date Found:'} {formatEventDate(item.eventDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="my-item-actions">
                  <div className="my-item-actions-left">
                    <Link 
                      to={`/items/${item.id}`} 
                      className="btn btn-outline btn-sm action-btn-view"
                      title="View public listing"
                    >
                      <Eye size={15} />
                      <span>View</span>
                    </Link>

                    <Link 
                      to={`/my-posts/${item.id}/edit`} 
                      className="btn btn-outline btn-sm action-btn-edit"
                      title="Edit report details"
                    >
                      <Edit3 size={15} />
                      <span>Edit</span>
                    </Link>

                    {!isResolved ? (
                      <button
                        type="button"
                        onClick={() => handleOpenResolveModal(item)}
                        className="btn btn-secondary btn-sm action-btn-resolve"
                        title="Mark as recovered or returned"
                      >
                        <CheckCircle2 size={15} />
                        <span>Mark Resolved</span>
                      </button>
                    ) : (
                      <span className="resolved-status-indicator">
                        <CheckCheck size={14} className="text-found" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>

                  {/* Delete Action Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenDeleteModal(item)}
                    className="btn btn-outline btn-sm action-btn-delete"
                    title="Permanently delete this report"
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Mark Resolved */}
      {resolvingItem && (
        <div className="modal-backdrop" onClick={handleCloseResolveModal}>
          <div className="modal-dialog card" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={handleCloseResolveModal}
              disabled={resolvingLoading}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            <div className="modal-icon-circle resolve-circle">
              <CheckCheck size={32} />
            </div>

            <h3 className="modal-title">Mark this report as resolved?</h3>

            <p className="modal-message">
              Use this when the lost item has been recovered or the found item has been successfully returned.
            </p>

            <div className="modal-item-preview">
              <span className="preview-label">Selected Report:</span>
              <strong className="preview-name">{resolvingItem.itemName}</strong>
              <span className="preview-type">({resolvingItem.type === 'lost' ? 'Lost Item' : 'Found Item'})</span>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCloseResolveModal}
                disabled={resolvingLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-confirm-resolve"
                onClick={handleConfirmResolve}
                disabled={resolvingLoading}
              >
                {resolvingLoading ? (
                  <>
                    <Loader2 size={18} className="auth-spinner" />
                    <span>Resolving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Mark Resolved</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete Item */}
      {deletingItem && (
        <div className="modal-backdrop" onClick={handleCloseDeleteModal}>
          <div className="modal-dialog card" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={handleCloseDeleteModal}
              disabled={deletingLoading}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            <div className="modal-icon-circle delete-circle">
              <AlertTriangle size={32} />
            </div>

            <h3 className="modal-title">Delete this report?</h3>

            <p className="modal-message">
              This will permanently remove the report from Lipa Lost &amp; Found. This action cannot be undone.
            </p>

            <div className="modal-item-preview delete-preview">
              <span className="preview-label">Item to Delete:</span>
              <strong className="preview-name">{deletingItem.itemName}</strong>
              <span className="preview-type">
                ({deletingItem.type === 'lost' ? 'Lost Item' : 'Found Item'} • {deletingItem.barangay})
              </span>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCloseDeleteModal}
                disabled={deletingLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger btn-confirm-delete"
                onClick={handleConfirmDelete}
                disabled={deletingLoading}
              >
                {deletingLoading ? (
                  <>
                    <Loader2 size={18} className="auth-spinner" />
                    <span>Deleting Report...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    <span>Delete Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
