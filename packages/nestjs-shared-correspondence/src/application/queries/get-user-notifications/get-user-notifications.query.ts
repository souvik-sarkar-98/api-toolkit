import { BaseFilter } from '@ssapi-toolkit/nestjs-shared-core';
import { UserNotificationFilter } from '../../../domain/aggregates/user-notification.aggregate';

export class GetUserNotificationsQuery {
  constructor(public readonly filter: BaseFilter<UserNotificationFilter>) {}
}
