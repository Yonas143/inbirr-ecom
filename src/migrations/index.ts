import * as migration_20261109_134145_initial from './20261109_134145_initial';

export const migrations = [
  {
    up: migration_20261109_134145_initial.up,
    down: migration_20261109_134145_initial.down,
    name: '20261109_134145_initial'
  },
];
