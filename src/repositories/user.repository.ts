import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RethinkDataSource} from '../datasources';
import {User, UserRelations} from '../models';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.email,
  UserRelations
> {
  constructor(@inject('datasources.rethink') dataSource: RethinkDataSource) {
    super(User, dataSource);
  }
}
