/**
 * Settings Actions Index
 *
 * Central export point for all settings-related server actions
 */

// Communications Settings
export {
  updateEmailSettings,
  getEmailSettings,
  updateSmsSettings,
  getSmsSettings,
  updatePhoneSettings,
  getPhoneSettings,
  updateNotificationSettings,
  getNotificationSettings,
} from "./communications";

// Customer Settings
export {
  updateCustomerPreferences,
  getCustomerPreferences,
  createCustomField,
  updateCustomField,
  deleteCustomField,
  getCustomFields,
  updateLoyaltySettings,
  getLoyaltySettings,
  updatePrivacySettings,
  getPrivacySettings,
  updatePortalSettings,
  getPortalSettings,
  updateIntakeSettings,
  getIntakeSettings,
} from "./customers";

// Work Settings
export {
  updateJobSettings,
  getJobSettings,
  updateEstimateSettings,
  getEstimateSettings,
  updateInvoiceSettings,
  getInvoiceSettings,
  updateServicePlanSettings,
  getServicePlanSettings,
  updatePricebookSettings,
  getPricebookSettings,
  updateBookingSettings,
  getBookingSettings,
} from "./work";

// Schedule Settings
export {
  updateAvailabilitySettings,
  getAvailabilitySettings,
  updateCalendarSettings,
  getCalendarSettings,
  updateTeamSchedulingRules,
  getTeamSchedulingRules,
  createServiceArea,
  updateServiceArea,
  deleteServiceArea,
  getServiceAreas,
} from "./schedule";

// Profile/User Settings
export {
  updateNotificationPreferences,
  getNotificationPreferences,
  updateUserPreferences,
  getUserPreferences,
  updatePersonalInfo,
  getPersonalInfo,
  updatePassword,
} from "./profile";

// Misc Settings (Tags, Checklists, Lead Sources, Import/Export)
export {
  updateTagSettings,
  getTagSettings,
  updateChecklistSettings,
  getChecklistSettings,
  createLeadSource,
  updateLeadSource,
  deleteLeadSource,
  getLeadSources,
  updateImportExportSettings,
  getImportExportSettings,
} from "./misc";

// Finance Settings
export {
  updateAccountingSettings,
  getAccountingSettings,
  updateBookkeepingSettings,
  getBookkeepingSettings,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  getBankAccounts,
  updateBusinessFinancingSettings,
  getBusinessFinancingSettings,
  updateConsumerFinancingSettings,
  getConsumerFinancingSettings,
  getDebitCards,
  getGasCards,
  updateGiftCardSettings,
  getGiftCardSettings,
  updateVirtualBucketSettings,
  getVirtualBucketSettings,
  getVirtualBuckets,
} from "./finance";

// Payroll Settings
export {
  updateOvertimeSettings,
  getOvertimeSettings,
  createCommissionRule,
  updateCommissionRule,
  deleteCommissionRule,
  getCommissionRules,
  createCommissionTier,
  getCommissionTiers,
  getBonusRules,
  getCallbackSettings,
  getDeductionTypes,
  getMaterialSettings,
  updatePayrollSchedule,
  getPayrollSchedule,
} from "./payroll";
