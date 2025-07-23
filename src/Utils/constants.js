export const REPORT_TYPES = {
  RED_FLAG: 'red_flag',
  INTERVENTION: 'intervention',
};

export const REPORT_STATUSES = {
  DRAFT: 'draft',
  UNDER_INVESTIGATION: 'under_investigation',
  REJECTED: 'rejected',
  RESOLVED: 'resolved',
};

export const REPORT_TYPE_LABELS = {
  [REPORT_TYPES.RED_FLAG]: 'Red Flag',
  [REPORT_TYPES.INTERVENTION]: 'Intervention',
};

export const REPORT_STATUS_LABELS = {
  [REPORT_STATUSES.DRAFT]: 'Draft',
  [REPORT_STATUSES.UNDER_INVESTIGATION]: 'Under Investigation',
  [REPORT_STATUSES.REJECTED]: 'Rejected',
  [REPORT_STATUSES.RESOLVED]: 'Resolved',
};

export const STATUS_COLORS = {
  [REPORT_STATUSES.DRAFT]: 'bg-gray-100 text-gray-800',
  [REPORT_STATUSES.UNDER_INVESTIGATION]: 'bg-warning-100 text-warning-800',
  [REPORT_STATUSES.REJECTED]: 'bg-error-100 text-error-800',
  [REPORT_STATUSES.RESOLVED]: 'bg-success-100 text-success-800',
};

export const TYPE_COLORS = {
  [REPORT_TYPES.RED_FLAG]: 'bg-error-50 text-error-700 border-error-200',
  [REPORT_TYPES.INTERVENTION]: 'bg-primary-50 text-primary-700 border-primary-200',
};