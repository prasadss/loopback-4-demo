import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RethinkDataSource} from '../datasources';
import {Location, LocationRelations} from '../models';

export class LocationRepository extends DefaultCrudRepository<
  Location,
  typeof Location.prototype.id,
  LocationRelations
> {
  constructor(
    @inject('datasources.rethink') dataSource: RethinkDataSource,
  ) {
    super(Location, dataSource);
  }
}
