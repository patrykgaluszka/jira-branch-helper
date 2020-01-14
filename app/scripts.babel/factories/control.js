import { abstractControl } from './abstract-control';

export const createControl = ($el, type, _modelPath, _defaults, _storage) => ({
  ...abstractControl,
  $el,
  type,
  _modelPath,
  _defaults,
  _storage,
});
