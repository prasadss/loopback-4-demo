import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'rethink',
  connector: 'rethinkdb',
  url: 'http://localhost:28015/demo',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class RethinkDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'rethink';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.rethink', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
