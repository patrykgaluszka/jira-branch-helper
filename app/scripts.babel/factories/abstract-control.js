import * as F from '../helpers/functional.helper';

export const abstractControl = {
  _assignByPath(path, parentObj, value) {
    const pathToObj = path.slice(0, -1);
    const propName = path.slice(-1);

    if (pathToObj.length) {
      F.path(pathToObj)(parentObj)[propName] = value;
    } else {
      parentObj[propName] = value;
    }
  },
  _reflectToElements(value) {
    const { $el, type } = this;

    switch(type) {
      case 'text':
        $el.value = value;
        break;
      case 'check':
        for (let check of $el) {
          const optionName = check.value;
          check.checked = value[optionName];
        }
    }
  },
  getValue() {
    return F.path(this._modelPath)(this._storage);
  },
  setValue(value) {
    if (value === undefined) {
      const defaultVal = F.path(this._modelPath)(this._defaults);

      this._assignByPath(this._modelPath, this._storage, defaultVal);
      this._reflectToElements(defaultVal);
    } else {
      this._assignByPath(this._modelPath, this._storage, value);
      this._reflectToElements(value);
    }
  },
  addEventListener(event, functions, ...addArgs) {
    const callback = F.queue(...functions);
    const { $el, type } = this;

    switch(type) {
      case 'text':
        $el.addEventListener(event, callback, ...addArgs);
        return (...removeArgs) => this.$el.removeEventListener(event, callback, ...removeArgs);
      case 'check':
        return Array.from($el).reduce((acc, el) => {
          el.addEventListener(event, callback, ...addArgs);
          return [...acc, (...removeArgs) => el.removeEventListener(event, callback, ...removeArgs)];
        }, []);
    }
  },
  addEventListeners(callbacks) {
    return Object.keys(callbacks).reduce((acc, event) => ({
      ...acc,
      [event]: this.addEventListener(event, callbacks[event])
    }), {});
  }
};
