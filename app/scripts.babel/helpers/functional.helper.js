const _curryMethod = (method, expectArgs) => {
  if (expectArgs) {
    return (...args) => (owner) => owner[method](...args);
  }
  
  return (owner) => owner[method]();
};

export const toLatin = (str) => str ? str.latinise() : '';
export const toLowerCase = _curryMethod('toLowerCase');
export const toUpperCase = _curryMethod('toUpperCase');
export const trim = _curryMethod('trim');
export const onlyDigitsOrLatinLetters = (str) => str.replace(/([^\w\s]|_)/gi, ' ')
export const reduceSpaces = (str) => str.trim().replace(/\s+/g, ' ');
export const replace = (from, to) => (str) => str.split(from).join(to);
export const replaceFirst = _curryMethod('replace', true);
export const stripBracketTags = (str) => str.replace(/\[[^\]]+\]/g, '')
export const unquote = (str) => str.replace(/(^['"]|['"]$)/g, '');

export const path = (propsPath) => (obj) => {
  const prop = obj[propsPath[0]];
  const propsPathLeft = propsPath.slice(1);

  if (prop) {
    if (propsPathLeft.length) {
      return path(propsPathLeft)(prop);
    }

    return prop;
  }
}

export const queue = (...funcs) => (arg) => {
  for (let func of funcs) {
    func(arg);
  }
};

export const pipe = (...funcs) => (arg) => {
  let lastReturned = arg;

  for (let func of funcs) {
    lastReturned = func(lastReturned);
  }

  return lastReturned;
};
