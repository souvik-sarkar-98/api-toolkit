import { BaseFilter } from '@api-toolkit/nestjs-shared-core';
import { PermissionFilter } from '../../../domain/aggregates/permission/permission.aggregate';

export class ListPermissionsQuery {
  constructor(public readonly filter?: BaseFilter<PermissionFilter>) { }
}
