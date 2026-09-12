import { BaseFilter } from '@ssapi-toolkit/nestjs-shared-core';
import { NotificationFilter } from '../../../domain/aggregates/notification.aggregate';

export class GetNotificationsAdminQuery {
  constructor(public readonly filter: BaseFilter<NotificationFilter>) {}
}
