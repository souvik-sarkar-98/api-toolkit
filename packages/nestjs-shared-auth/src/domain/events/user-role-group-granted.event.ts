import { DomainEvent } from '@api-toolkit/nestjs-shared-core';
import type { UserRoleGroup } from '../aggregates/user-role-group/user-role-group.aggregate';

export type UserRoleGroupGrantedSnapshot = Pick<UserRoleGroup, 'id' | 'idpSub' | 'groupId' | 'ownerId'>;

export class UserRoleGroupGrantedEvent extends DomainEvent<UserRoleGroupGrantedSnapshot> {
  constructor(snapshot: UserRoleGroupGrantedSnapshot) {
    super(snapshot.id, snapshot);
  }
}
