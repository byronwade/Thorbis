/**
 * Settings Actions Index
 *
 * Central export point for all settings-related server actions
 */

// Communications Settings
export {
  getEmailSettings,
  getNotificationSettings,
  getPhoneSettings,
  getSmsSettings,
  updateEmailSettings,
  updateNotificationSettings,
  updatePhoneSettings,
  updateSmsSettings,
} from "./communications";

// Customer Settings
export {
  createCustomField,
  deleteCustomField,
  getCustomerPreferences,
  getCustomFields,
  getIntakeSettings,
  getLoyaltySettings,
  getPortalSettings,
  getPrivacySettings,
  updateCustomerPreferences,
  updateCustomField,
  updateIntakeSettings,
  updateLoyaltySettings,
  updatePortalSettings,
  updatePrivacySettings,
} from "./customers";
// Finance Settings
export {
  createBankAccount,
  deleteBankAccount,
  getAccountingSettings,
  getBankAccounts,
  getBookkeepingSettings,
  getBusinessFinancingSettings,
  getConsumerFinancingSettings,
  getDebitCards,
  getGasCards,
  getGiftCardSettings,
  getPrimaryBankAccount,
  getUserCompanyId,
  getVirtualBucketSettings,
  getVirtualBuckets,
  updateAccountingSettings,
  updateBankAccount,
  updateBookkeepingSettings,
  updateBusinessFinancingSettings,
  updateConsumerFinancingSettings,
  updateGiftCardSettings,
  updateVirtualBucketSettings,
} from "./finance";
// Misc Settings (Tags, Checklists, Lead Sources, Import/Export)
export {
  createLeadSource,
  deleteLeadSource,
  getChecklistSettings,
  getImportExportSettings,
  getLeadSources,
  getTagSettings,
  updateChecklistSettings,
  updateImportExportSettings,
  updateLeadSource,
  updateTagSettings,
} from "./misc";
// Payroll Settings
export {
  createCommissionRule,
  createCommissionTier,
  deleteCommissionRule,
  getBonusRules,
  getCallbackSettings,
  getCommissionRules,
  getCommissionTiers,
  getDeductionTypes,
  getMaterialSettings,
  getOvertimeSettings,
  getPayrollSchedule,
  updateCommissionRule,
  updateOvertimeSettings,
  updatePayrollSchedule,
} from "./payroll";
// Procurement / Feature Toggles
export { togglePurchaseOrderSystem } from "./procurement";
// Profile/User Settings
export {
  getNotificationPreferences,
  getPersonalInfo,
  getUserPreferences,
  updateNotificationPreferences,
  updatePassword,
  updatePersonalInfo,
  updateUserPreferences,
} from "./profile";
// Schedule Settings
export {
  createDispatchRule,
  createServiceArea,
  deleteDispatchRule,
  deleteServiceArea,
  getAvailabilitySettings,
  getCalendarSettings,
  getDispatchRules,
  getScheduleOverview,
  getServiceAreas,
  getTeamSchedulingRules,
  updateAvailabilitySettings,
  updateCalendarSettings,
  updateDispatchRule,
  updateServiceArea,
  updateTeamSchedulingRules,
} from "./schedule";
// Work Settings
export {
  getBookingSettings,
  getEstimateSettings,
  getInvoiceSettings,
  getJobSettings,
  getPricebookSettings,
  getServicePlanSettings,
  updateBookingSettings,
  updateEstimateSettings,
  updateInvoiceSettings,
  updateJobSettings,
  updatePricebookSettings,
  updateServicePlanSettings,
} from "./work";
