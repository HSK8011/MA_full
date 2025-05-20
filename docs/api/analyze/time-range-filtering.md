# Time Range Filtering

## Overview
The Analyze page allows users to filter analytics data by different time ranges. This functionality enables users to view performance metrics for specific periods and compare data across different time frames.

## Available Time Ranges

| Display Name | API Value | Description |
|---|---|---|
| 7 Days | 7d | Data from the last 7 days |
| 30 Days | 30d | Data from the last 30 days (default) |
| 3 Months | 3m | Data from the last 3 months |
| 6 Months | 6m | Data from the last 6 months |
| 1 Year | 1y | Data from the last year |

## API Implementation

### Time Range Parameter

When requesting analytics data, the client should include a `timeRange` parameter with the API request:

```
GET /api/analytics/{accountId}?timeRange=30d
```

### Date Calculation

- The end date for all time ranges is the current date (now)
- The start date is calculated by subtracting the specified time period from the end date
- All dates are calculated in the user's timezone when possible

### Example Response Differences

#### 7-Day Response Example
```json
{
  "accountId": "acc_123456",
  "timeRange": "7d",
  "dateRange": {
    "start": "2023-03-14T00:00:00Z",
    "end": "2023-03-21T23:59:59Z"
  },
  "metrics": {
    "tweets": 127,
    "likes": 842,
    "followers": 20,
    "engagements": 1245,
    "audienceGrowth": 15,
    "audienceGrowthPercentage": 0.8
  },
  "hourlyActivityDistribution": {
    "0": 3,
    "1": 1,
    "2": 0,
    // ... hours 3-22 ...
    "23": 4
  }
}
```

#### 1-Year Response Example
```json
{
  "accountId": "acc_123456",
  "timeRange": "1y",
  "dateRange": {
    "start": "2022-03-21T00:00:00Z",
    "end": "2023-03-21T23:59:59Z"
  },
  "metrics": {
    "tweets": 4280,
    "likes": 35842,
    "followers": 12500,
    "engagements": 128745,
    "audienceGrowth": 8750,
    "audienceGrowthPercentage": 232.5
  },
  "monthlyActivityDistribution": {
    "2022-03": 320,
    "2022-04": 410,
    // ... other months ...
    "2023-03": 127
  }
}
```

## Data Granularity

The granularity of the data returned depends on the selected time range:

| Time Range | Data Granularity |
|---|---|
| 7 Days | Hourly data available |
| 30 Days | Daily data available |
| 3 Months | Daily and weekly aggregates |
| 6 Months | Weekly aggregates |
| 1 Year | Monthly aggregates |

## Client Implementation

### Time Range Selector Component

The time range selector in the UI allows users to switch between different predefined time periods:

```jsx
<select
  className="appearance-none border border-gray-300 rounded-md p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
  onChange={handleTimeRangeChange}
  value={timeRange}
>
  <option value="7d">7 Days</option>
  <option value="30d">30 Days</option>
  <option value="3m">3 Months</option>
  <option value="6m">6 Months</option>
  <option value="1y">1 Year</option>
</select>
```

### Handling Time Range Changes

When a user selects a different time range, the client should:

1. Update the time range state
2. Re-fetch analytics data with the new time range
3. Update UI visualizations to reflect the new time period

```javascript
const handleTimeRangeChange = (e) => {
  const newTimeRange = e.target.value;
  setTimeRange(newTimeRange);
  
  // Fetch data with new time range
  fetchAnalyticsData(selectedAccount.id, newTimeRange);
};
```

## Visual Presentation

The UI adjusts based on the selected time range:

- **Short time ranges (7d, 30d)**: Show more detailed charts with higher granularity
- **Medium time ranges (3m, 6m)**: Show trend charts with weekly data points
- **Long time ranges (1y)**: Show monthly aggregated data and yearly comparisons

## Performance Considerations

1. Data for longer time ranges may be pre-aggregated in the database
2. Responses for longer time ranges may include fewer metrics to maintain performance
3. Chart rendering optimizations may be applied for larger datasets

## Error Handling

### Invalid Time Range
```json
{
  "error": "Bad Request",
  "message": "Invalid time range specified. Allowed values: 7d, 30d, 3m, 6m, 1y",
  "code": "INVALID_TIME_RANGE"
}
```

### Data Availability
```json
{
  "error": "Data Unavailable",
  "message": "Analytics data not available for the requested time range",
  "code": "DATA_UNAVAILABLE", 
  "availableFrom": "2022-09-15T00:00:00Z"
}
``` 