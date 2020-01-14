import * as F from './functional.helper';

const _getStringParts = (pattern) => pattern.split(/\$\{[^\}]+\}/g);
const _getVarParts = (pattern) => Array.from(
      pattern.matchAll(/\$\{[^\}]+\}/g),
      match => match[0].substring(2, match[0].length - 1)
    );

function _resolveVar(varName, scope) {
  if (!scope[varName]) {
    throw new Error(`"${varName}" is not a known variable`);
  }
  
  return scope[varName];
}

function _unquotePipeArgs(pipeArgs) {
  return pipeArgs.map(arg => {
    const argUnquoted = F.unquote(arg);

    if (argUnquoted.length === arg.length) {
      throw new Error(`Expected pipe argument to be a quoted string, but got: ${arg}`);
    }
    
    return argUnquoted;
  });
};

function _resolvePipes(pipeExps) {
  return pipeExps.map(pipeExp => {
    const [pipeName, ...pipeArgs] = pipeExp.split(':').map(el => el.trim());
    const pipeArgsUnquoted = _unquotePipeArgs(pipeArgs);

    let pipe;

    switch (pipeName) {
      case 'lowc':
        pipe = F.toLowerCase;
        break;
      case 'uppc':
        pipe = F.toUpperCase;
        break;
      case 'rep':
        pipe = F.replace
        break;
      case 'repf':
        pipe = F.replaceFirst
        break;
      default:
        throw new Error(`"${pipeName}" is not a known pipe`);
    }
    
    try {
      if (pipeArgsUnquoted.length) {
        pipe(...pipeArgsUnquoted)('');
        return pipe(...pipeArgsUnquoted);
      }

      return pipe;
    } catch (error) {
      throw new Error(`Pipe "${pipeName}" should not get arguments passed`);
    }
  });
}

function _resolveExpressions(exp, scope) {
  const [varName, ...pipeExps] = exp.split('|').map(el => el.trim());
  const base = _resolveVar(varName, scope);
  
  if (!pipeExps.length) {
    return base;
  }
  
  const pipes = _resolvePipes(pipeExps);
  
  return F.pipe(...pipes)(base);
};

export function useMiddlewares(str, config) {
  const allowed = [
    'toLatin',
    'stripBracketTags',
    'onlyDigitsOrLatinLetters',
    'reduceSpaces',
  ];
  const activeMiddlewares = allowed.reduce(
    (acc, fnName) => config[fnName] ? [...acc, F[fnName]] :  acc,
    []
  );

  return F.pipe(...activeMiddlewares)(str);
}

export function resolvePattern(pattern, scope) {
  const str = _getStringParts(pattern);
  const vars = _getVarParts(pattern);

  const result = [...Array((str.length + vars.length)).keys()]
      .map((e, index) => {
        const iteration = index + 1;
        
        if (iteration % 2) {
          const strIndex = Math.ceil(iteration / 2) - 1;
          return str[strIndex];
        }
        
        const varsIndex = (iteration / 2) - 1;
        return _resolveExpressions(vars[varsIndex], scope);
      })
      .join('');

  return result;
};
