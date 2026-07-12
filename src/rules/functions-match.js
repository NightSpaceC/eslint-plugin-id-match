/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require identifiers of functions to match a specified regular expression',
    },
    schema: [
      {
        type: 'string',
      },
    ],
    messages: {
      notMatch: "Identifier '{{name}}' does not match the pattern '{{pattern}}'.",
    },
  },

  create(context) {
    /** @type {[ pattern: string ]} */
    const [pattern] = context.options;
    const regexp = new RegExp(pattern, 'u');

    /** @type {(id: import('estree').Identifier) => void} */
    const tryReport = id => {
      const { name } = id;
      if (regexp.test(name)) {
        return;
      }
      context.report({
        node: id,
        messageId: 'notMatch',
        data: {
          name,
          pattern,
        },
      });
    };

    return {
      // eslint-disable-next-line id-match/properties-match
      FunctionDeclaration(node) {
        const { id } = node;
        tryReport(id);
      },
      // eslint-disable-next-line id-match/properties-match
      FunctionExpression(node) {
        const { id } = node;
        if (id === null) {
          return;
        }
        tryReport(id);
      },
    };
  },
};
