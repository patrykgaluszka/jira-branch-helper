import * as F from '../helpers/functional.helper';
import { createControl } from './control';

export const abstractForm = {
  getValues() {
    return JSON.parse(JSON.stringify(this._storage));
  },
  setControl(type, name, _modelPath) {
    let $el;
    const fromPath = F.path(_modelPath);

    const storage = this._storage;
    const defaults = this._defaults;

    const defaultVal = fromPath(defaults);
    const savedVal = fromPath(storage);

    switch (type) {
      case 'text':
        $el = document.querySelector(`[name="${name}"]`);
        $el.value = savedVal;
        $el.setAttribute('placeholder', `ie. ${defaultVal}`);

        break;
      case 'check':
        $el = document.querySelectorAll(`[name="${name}"]`);

        for (let check of $el) {
          const optionName = check.value;
          check.checked = savedVal[optionName];
        }
    }

    this.inputs[name] = createControl(
      $el,
      type,
      _modelPath,
      this._defaults,
      this._storage,
    );

    return this.inputs[name];
  },
};
