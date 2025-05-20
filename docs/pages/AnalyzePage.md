# Analyze Page

## Overview

The Analyze page provides users with comprehensive analytics and performance metrics for their social media accounts. This dashboard-style page displays engagement statistics, audience growth, and most popular content across connected platforms.

## Page Purpose

The primary purpose of this page is to:
- Provide at-a-glance performance metrics for social media accounts
- Display engagement statistics in a clear, visual format
- Show trending and top-performing content
- Allow filtering of data by time periods and accounts
- Offer insights to help users improve their social media strategy

## URL Path

```
/analyze
```

## Page Components

### 1. Analyze (Page Component)
- **File**: `src/pages/Analyze.tsx`
- **Purpose**: Container component that handles authentication checking and loads the AnalyzeContent component
- **State**:
  - `isLoading`: Boolean to track authentication verification

### 2. AnalyzeContent (Organism Component)
- **File**: `src/components/organisms/Analyze/AnalyzeContent.tsx`
- **Purpose**: Main content component that displays analytics dashboard
- **State**:
  - `selectedAccount`: Object containing the currently selected account
  - `timeRange`: String representing the selected time period (e.g., "30 Days")
  - `analyticsData`: Object containing all metrics and data for display

### 3. Account Selector
- Account dropdown with company name and logo
- Positioned at the top-left of the analytics content
- Allows switching between different connected accounts

### 4. Time Range Selector
- Dropdown menu to select the time period for data analysis
- Options include "7 Days", "30 Days", "3 Months", "6 Months", "1 Year"
- Positioned at the top-right of the analytics content

### 5. Tab Navigation
- Horizontal tab system with options:
  - General: Overall account performance metrics
  - Posts: Post-specific performance metrics
- Located below the account and time range selectors

### 6. Analytics Cards
- A set of metric cards displaying key statistics:
  - **Tweets**: Total number of tweets (represented by a Twitter icon)
  - **Likes**: Total number of likes/reactions (represented by a heart icon)
  - **Followers**: Total number of followers (represented by a users icon)
  - **Engagements**: Total number of engagements (represented by a comments icon)
  - **Audience Growth**: Growth rate of audience (represented by a trend icon)
- Each card includes:
  - Icon representing the metric
  - Large numeric value
  - Descriptive label below the value

### 7. Most Liked Posts Section
- Table-based view showing the most popular content
- Each entry includes:
  - Account profile photo
  - Account handle/name
  - Post date
  - Post content with any attached media
- Shows engagement data per post

## User Flows

### Viewing Analytics Dashboard
1. User navigates to the Analyze page from sidebar
2. System loads the default selected account's analytics data
3. Dashboard displays current metrics for the default time period (30 Days)
4. User can view all key metrics at a glance

### Changing Account
1. User clicks the account selector dropdown
2. A list of connected accounts appears
3. User selects a different account
4. Dashboard refreshes to display metrics for the newly selected account

### Adjusting Time Range
1. User clicks the time range dropdown (e.g., "30 Days")
2. Available time range options are displayed
3. User selects a different time range (e.g., "3 Months")
4. Dashboard refreshes to show metrics for the selected time period

### Switching Between Tabs
1. User clicks on a different tab (e.g., "Posts" tab)
2. Dashboard content updates to show tab-specific analytics
3. The selected tab is highlighted to indicate current view

## Data Model

```typescript
interface AnalyticsData {
  accountId: string;
  accountName: string;
  timeRange: string;
  metrics: {
    tweets: number;
    likes: number;
    followers: number;
    engagements: number;
    audienceGrowth: number;
    audienceGrowthPercentage?: number;
  };
  topPosts: Array<{
    id: string;
    platform: string;
    content: string;
    date: string;
    likes: number;
    comments: number;
    shares: number;
    mediaUrl?: string;
  }>;
  graphData?: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }>;
  };
}
```

## API Endpoints

This page interacts with the following API endpoints:

- `GET /api/analytics/accounts` - Retrieve list of accounts with analytics access
- `GET /api/analytics/metrics` - Retrieve summary metrics for a specific account and time range
- `GET /api/analytics/top-posts` - Retrieve most engaged posts for a specific account and time range

For detailed API specifications, see [Analytics API Documentation](../api/analytics/analytics-endpoints.md).

## Design and UX Considerations

- Clear, visually distinctive cards for each key metric
- Consistent use of recognizable icons to represent different metric types
- Color-coding for metrics to indicate positive/negative performance
- Mobile-responsive layout that adapts to different screen sizes
- Minimalist design to prevent information overload
- Easily accessible dropdowns for filtering and customization
- Visual hierarchy that emphasizes the most important metrics

## Related Components

- [Sidebar](../components/Sidebar.md) - Contains the navigation item to access this page
- [DashboardTemplate](../components/DashboardTemplate.md) - Parent layout component

## Future Enhancements

- Export options for analytics data (PDF, CSV, etc.)
- Additional tabs for more detailed metrics (audience demographics, best posting times)
- Custom date range selector for more granular time period analysis
- Comparative analytics to benchmark against industry standards
- Predictive analytics for optimal posting schedules
- Integration with Google Analytics for website traffic correlation
- Custom dashboard creation with user-selected metrics
- Automated insights and recommendations based on performance data 

## Overview

The Analyze page provides users with comprehensive analytics and performance metrics for their social media accounts. This dashboard-style page displays engagement statistics, audience growth, and most popular content across connected platforms.

## Page Purpose

The primary purpose of this page is to:
- Provide at-a-glance performance metrics for social media accounts
- Display engagement statistics in a clear, visual format
- Show trending and top-performing content
- Allow filtering of data by time periods and accounts
- Offer insights to help users improve their social media strategy

## URL Path

```
/analyze
```

## Page Components

### 1. Analyze (Page Component)
- **File**: `src/pages/Analyze.tsx`
- **Purpose**: Container component that handles authentication checking and loads the AnalyzeContent component
- **State**:
  - `isLoading`: Boolean to track authentication verification

### 2. AnalyzeContent (Organism Component)
- **File**: `src/components/organisms/Analyze/AnalyzeContent.tsx`
- **Purpose**: Main content component that displays analytics dashboard
- **State**:
  - `selectedAccount`: Object containing the currently selected account
  - `timeRange`: String representing the selected time period (e.g., "30 Days")
  - `analyticsData`: Object containing all metrics and data for display

### 3. Account Selector
- Account dropdown with company name and logo
- Positioned at the top-left of the analytics content
- Allows switching between different connected accounts

### 4. Time Range Selector
- Dropdown menu to select the time period for data analysis
- Options include "7 Days", "30 Days", "3 Months", "6 Months", "1 Year"
- Positioned at the top-right of the analytics content

### 5. Tab Navigation
- Horizontal tab system with options:
  - General: Overall account performance metrics
  - Posts: Post-specific performance metrics
- Located below the account and time range selectors

### 6. Analytics Cards
- A set of metric cards displaying key statistics:
  - **Tweets**: Total number of tweets (represented by a Twitter icon)
  - **Likes**: Total number of likes/reactions (represented by a heart icon)
  - **Followers**: Total number of followers (represented by a users icon)
  - **Engagements**: Total number of engagements (represented by a comments icon)
  - **Audience Growth**: Growth rate of audience (represented by a trend icon)
- Each card includes:
  - Icon representing the metric
  - Large numeric value
  - Descriptive label below the value

### 7. Most Liked Posts Section
- Table-based view showing the most popular content
- Each entry includes:
  - Account profile photo
  - Account handle/name
  - Post date
  - Post content with any attached media
- Shows engagement data per post

## User Flows

### Viewing Analytics Dashboard
1. User navigates to the Analyze page from sidebar
2. System loads the default selected account's analytics data
3. Dashboard displays current metrics for the default time period (30 Days)
4. User can view all key metrics at a glance

### Changing Account
1. User clicks the account selector dropdown
2. A list of connected accounts appears
3. User selects a different account
4. Dashboard refreshes to display metrics for the newly selected account

### Adjusting Time Range
1. User clicks the time range dropdown (e.g., "30 Days")
2. Available time range options are displayed
3. User selects a different time range (e.g., "3 Months")
4. Dashboard refreshes to show metrics for the selected time period

### Switching Between Tabs
1. User clicks on a different tab (e.g., "Posts" tab)
2. Dashboard content updates to show tab-specific analytics
3. The selected tab is highlighted to indicate current view

## Data Model

```typescript
interface AnalyticsData {
  accountId: string;
  accountName: string;
  timeRange: string;
  metrics: {
    tweets: number;
    likes: number;
    followers: number;
    engagements: number;
    audienceGrowth: number;
    audienceGrowthPercentage?: number;
  };
  topPosts: Array<{
    id: string;
    platform: string;
    content: string;
    date: string;
    likes: number;
    comments: number;
    shares: number;
    mediaUrl?: string;
  }>;
  graphData?: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }>;
  };
}
```

## API Endpoints

This page interacts with the following API endpoints:

- `GET /api/analytics/accounts` - Retrieve list of accounts with analytics access
- `GET /api/analytics/metrics` - Retrieve summary metrics for a specific account and time range
- `GET /api/analytics/top-posts` - Retrieve most engaged posts for a specific account and time range

For detailed API specifications, see [Analytics API Documentation](../api/analytics/analytics-endpoints.md).

## Design and UX Considerations

- Clear, visually distinctive cards for each key metric
- Consistent use of recognizable icons to represent different metric types
- Color-coding for metrics to indicate positive/negative performance
- Mobile-responsive layout that adapts to different screen sizes
- Minimalist design to prevent information overload
- Easily accessible dropdowns for filtering and customization
- Visual hierarchy that emphasizes the most important metrics

## Related Components

- [Sidebar](../components/Sidebar.md) - Contains the navigation item to access this page
- [DashboardTemplate](../components/DashboardTemplate.md) - Parent layout component

## Future Enhancements

- Export options for analytics data (PDF, CSV, etc.)
- Additional tabs for more detailed metrics (audience demographics, best posting times)
- Custom date range selector for more granular time period analysis
- Comparative analytics to benchmark against industry standards
- Predictive analytics for optimal posting schedules
- Integration with Google Analytics for website traffic correlation
- Custom dashboard creation with user-selected metrics
- Automated insights and recommendations based on performance data 