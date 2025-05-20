# Marketing Automation Application Documentation

## Overview

This documentation provides comprehensive information about the Marketing Automation Application, its features, workflows, and integration points. The documentation is organized by topic to help users and developers quickly find the information they need.

## Documentation Structure

### User Guides

* **[QueueTimesSettings.md](QueueTimesSettings.md)** - Configuration guide for setting up preferred posting schedules for social media accounts
* **[PublishingWithQueueTimes.md](PublishingWithQueueTimes.md)** - Workflow for scheduling posts using the Queue Times feature
* **[ManageQueueTimes.md](ManageQueueTimes.md)** - Overview of the Queue Times management interface

### API Documentation

API documentation is available in the `../api/` directory:

* **[queue-settings.md](../api/queue-settings.md)** - API endpoints for managing queue time settings
* **[publish/manage-queue-times.md](../api/publish/manage-queue-times.md)** - API endpoints for managing content publication using queue times

## Feature Relationships

The Queue Times feature connects with multiple application components:

```
                ┌───────────────────┐
                │ Account Settings  │
                │                   │
                │ ┌───────────────┐ │
                │ │ Set Queue     │ │
                │ │ Times Tab     │ │
                │ └───────────────┘ │
                └─────────┬─────────┘
                          │
                          ▼
           ┌─────────────────────────────┐
           │ Queue Settings Database     │
           └─────────────┬───────────────┘
                         │
                         ▼
┌───────────────────────────────────────────────┐
│                                               │
│  ┌─────────────────┐       ┌───────────────┐  │
│  │ Post Creator    │       │ Content       │  │
│  │                 │       │ Calendar      │  │
│  │ "Preferred Queue│       │               │  │
│  │  Time" Option   │───────▶ Scheduled     │  │
│  │                 │       │ Posts View    │  │
│  └─────────────────┘       │               │  │
│                            └───────────────┘  │
│                                               │
└───────────────────────────────────────────────┘
```

## How To Use This Documentation

1. **New Users**: Start with [PublishingWithQueueTimes.md](PublishingWithQueueTimes.md) for an overview of the feature workflow
2. **Configuring Settings**: Refer to [QueueTimesSettings.md](QueueTimesSettings.md) for detailed configuration instructions
3. **Developers**: Check the API documentation in the `../api/` directory for integration details

## Updating Documentation

When updating features, please ensure that the documentation is kept in sync:

1. User guide documents should be updated to reflect UI changes
2. API documentation should be updated when endpoints are modified
3. Workflow diagrams should be updated to reflect process changes
4. Cross-references between documents should be maintained 