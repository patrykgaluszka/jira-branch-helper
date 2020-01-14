export const defaultSettings = {
  issueId: {
    testVar: 'PROJ123i-602',
  },
  issueName: {
    testVar: '[BUG] Błędna nazwa w nagłówku elementu #12',
    middlewares: {
      'toLatin': true,
      'stripBracketTags': false,
      'onlyDigitsOrLatinLetters': true,
      'reduceSpaces': true,
    }
  },
  branchNaming: {
    pattern: '${issueId | lowc}-${issueName | lowc | rep: " " : "-"}',
  },
};
