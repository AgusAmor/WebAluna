/**
 * User Services - Centralized Export Point
 *
 * Organized user service exports by category:
 * - User Management: CRUD operations
 * - User Form: Form handling and normalization
 * - User Profile: Profile management operations
 * - Address Utilities: Address manipulation (from utils)
 * - Phone Utilities: Phone number manipulation (from utils)
 */

// User Management Services
export * from "./userManagementService.js";

// User Form Services
export * from "./userFormService.js";

// User Profile Services
export * from "./profileService.js";

// Address Utilities (consolidated location)
export * from "../../utils/addressUtils.js";

// Phone Utilities (consolidated location)
export * from "../../utils/phoneUtils.js";
