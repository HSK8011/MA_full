# Publishing Posts with Queue Times

## Overview

This guide explains how to use the Queue Times feature when publishing social media content. The Queue Times system allows you to define preferred posting schedules for each social media account, enabling consistent posting patterns without manually scheduling each post.

## Queue Times vs Regular Scheduling

| Feature | Queue Times | Regular Scheduling |
|---------|-------------|-------------------|
| Timing | Uses pre-configured time slots | Requires manually selecting time |
| Consistency | Maintains regular posting schedule | Each post scheduled independently |
| Setup | Configure once, use repeatedly | Set up individually for each post |
| Best for | Consistent content distribution | Special or time-sensitive content |

## Setting Up Queue Times

Before using the Queue Times feature for publishing, you need to configure your preferred posting times:

1. Navigate to **Account Settings**
2. Select the **Set Queue Times** tab
3. Choose the social account you want to configure from the dropdown
4. For each day of the week:
   - Toggle days on/off to enable/disable posting
   - Add, remove, or modify time slots as needed
5. Click **Save Queue Time Settings** to store your preferences

For detailed configuration instructions, see [Queue Times Settings](QueueTimesSettings.md).

## Publishing with Queue Times

When creating a new post, you can choose to add it to your content queue:

1. Create your post content in the Post Creator
2. Select the social accounts for publishing
3. In the publishing options, select **Preferred Queue Time**
4. Click **Place Now**

The system will:
1. Identify the next available time slot based on your Queue Times settings
2. Automatically schedule the post for that time slot
3. Display the scheduled time in your content calendar

![Publishing Workflow](../assets/queue-times-publishing.png)

## Queue Logic

When you add a post to the queue:

1. The system looks at the current time and identifies the next available slot from your Queue Times settings
2. If today has no available slots remaining (or they're all in the past), it checks the next enabled day
3. If multiple accounts are selected with different queue settings, the system will create separate scheduled posts for each account

**Example:**
- Current time: Monday, 11:30 AM
- Monday queue times: 9:00 AM, 12:30 PM, 5:00 PM
- Your post will be scheduled for Monday, 12:30 PM (the next available slot)

## Managing Queued Posts

Posts added to the queue behave like any other scheduled post once they're assigned a time:

- View them in the **Scheduled** tab of your content calendar
- Edit or reschedule them as needed
- Cancel them if they're no longer needed

## Best Practices

For the most effective use of Queue Times:

1. **Analyze Best Posting Times**: Set queue times based on when your audience is most active
2. **Balance Frequency**: Configure enough time slots to maintain presence without overwhelming followers
3. **Vary By Platform**: Set different schedules for different platforms based on their unique audience behavior
4. **Consider Time Zones**: If you have a global audience, distribute posting times accordingly
5. **Regular Review**: Periodically review and update your queue settings based on performance data

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Post wasn't added to queue | Verify you selected "Preferred Queue Time" option before clicking "Place Now" |
| Queue time is too far away | Add more time slots to your Queue Times settings for more frequent posting |
| Queue shows wrong time | Check your timezone settings in Account > Profile Settings |

## Related Features

- [Content Calendar](ContentCalendar.md) - View and manage all scheduled posts
- [Queue Times Settings](QueueTimesSettings.md) - Configure your preferred posting schedule
- [Analytics Integration](AnalyticsIntegration.md) - Use performance data to optimize posting times

## API Integration

If you're using our API to manage queue times, refer to the [Queue Settings API Documentation](../api/queue-settings.md) for details on the available endpoints and functionality. 