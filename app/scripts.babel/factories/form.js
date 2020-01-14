import { abstractForm } from './abstract-form';

export const createForm = (defaults, initStorage) => ({
  ...abstractForm,
  _defaults: JSON.parse(JSON.stringify(defaults)),
  _storage: JSON.parse(JSON.stringify(initStorage)),
  inputs: {},
});
