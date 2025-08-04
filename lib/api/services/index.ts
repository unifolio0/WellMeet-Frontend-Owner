export { default as authService } from './auth.service';
export { default as dashboardService } from './dashboard.service';
export { default as bookingsService } from './bookings.service';
export { default as customersService } from './customers.service';
export { default as reviewsService } from './reviews.service';
export { default as analyticsService } from './analytics.service';
export { default as restaurantService } from './restaurant.service';
export { default as notificationsService } from './notifications.service';
export { default as profileService } from './profile.service';
export { default as accountService } from './account.service';
export { default as settingsService } from './settings.service';

// Auth exports
export type { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, LogoutResponse } from './auth.service';

// Dashboard exports
export type { TodayStats, Customer as DashboardCustomer, RecentBooking, KpiItem, KpiData, TimeSlot, RecentBookingsParams, TimeSlotsParams } from './dashboard.service';

// Bookings exports
export type { BookingStatus, BookingCustomer, Booking, BookingDetail, BookingsListParams, BookingsListResponse, UpdateBookingStatusRequest, UpdateBookingRequest, SearchBookingsParams } from './bookings.service';

// Customers exports
export type { Customer, CustomerDetail, CustomersListParams, CustomersListResponse, CreateCustomerRequest, UpdateCustomerRequest, CustomerBooking, CustomerReview, UpdateVipStatusRequest } from './customers.service';

// Reviews exports
export type { ReviewCustomer, ReviewBooking, Review, ReviewsListParams, ReviewsListResponse, ReviewStats, AddReplyRequest, UpdateReplyRequest } from './reviews.service';

// Analytics exports
export type { AnalyticsPeriod, DataPeriod, DashboardAnalyticsParams, DashboardAnalytics, WeeklyDataParams, WeeklyData, CustomerTypeData, TimeSlotData, RevenueTrendParams, RevenueTrendData } from './analytics.service';

// Restaurant exports
export type { RestaurantAddress, Restaurant, UpdateRestaurantRequest, UploadImageResponse, DayOperatingHours, OperatingHours, UpdateOperatingHoursRequest, MenuItem, CreateMenuItemRequest, UpdateMenuItemRequest, UpdateMenuAvailabilityRequest } from './restaurant.service';

// Notifications exports
export type { Notification, NotificationsListParams, NotificationsListResponse, NotificationSettings, UpdateNotificationSettingsRequest } from './notifications.service';

// Profile exports
export type { ProfileAddress, Profile, UpdateProfileRequest, UploadProfileImageResponse } from './profile.service';

// Account exports
export type { ChangePasswordRequest, TwoFactorRequest, TwoFactorSettings, Session, LoginHistoryItem, LoginHistoryParams, LoginHistoryResponse, DeleteAccountRequest } from './account.service';

// Settings exports
export type { BookingPolicy, UpdateBookingPolicyRequest, AccessLog, AccessLogsParams, AccessLogsResponse, Integration, ConnectIntegrationRequest, ConnectIntegrationResponse, TestIntegrationResponse } from './settings.service';