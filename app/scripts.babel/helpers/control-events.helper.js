export const validateIfFalsy = (validationFn) => (event) => {
  if (!event.target.value) {
    validationFn();
  }
};

export const setDefaultIfFalsy = (form) => (event) => {
  const { value } = event.target;
  const name = event.target.getAttribute('name');
  const control = form.inputs[name];
  
  if (!value) {
    control.setValue();
  }
};

export const setControlValue = (form) => (event) => {
  const { value } = event.target;
  const name = event.target.getAttribute('name');
  const control = form.inputs[name];
  
  control.setValue(value);
};

export const setCheckControlsValue = (form) => (event) => {
  const { checked } = event.target;
  const option = event.target.value;
  const name = event.target.getAttribute('name');
  const control = form.inputs[name];
  const storedValue = control.getValue();
  
  control.setValue({
    ...storedValue,
    [option]: checked,
  });
};
