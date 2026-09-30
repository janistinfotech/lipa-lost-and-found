/**
 * Date and text formatting utilities for Lipa Lost & Found
 */

/**
 * Formats a Firestore Timestamp or Date object safely into a human-readable string.
 * e.g., "Sep 29, 2026"
 */
export const formatPostedDate = (timestamp) => {
  if (!timestamp) return 'Recently';

  try {
    let date;
    if (typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) return 'Recently';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Recently';
  }
};

/**
 * Formats a YYYY-MM-DD date string without causing timezone shifts.
 * e.g., "2026-09-29" -> "Sep 29, 2026"
 */
export const formatEventDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return 'Date unspecified';

  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);

      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

/**
 * Truncates text cleanly to a maximum character length with ellipsis.
 */
export const truncateText = (text, maxLength = 120) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
