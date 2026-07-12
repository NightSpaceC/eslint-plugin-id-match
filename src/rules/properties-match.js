/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require identifiers of the key of properties to match a specified regular expression',
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
    return {
      // eslint-disable-next-line id-match/properties-match
      ObjectExpression(node) {
        const { properties } = node;
        for (const property of properties) {
          if (property.type !== 'Property') {
            continue;
          }
          const { key } = property;
          if (key.type !== 'Identifier') {
            continue;
          }
          /** @type {{ name: string }} */
          const { name } = key;
          if (regexp.test(name)) {
            return;
          }
          context.report({
            node: key,
            messageId: 'notMatch',
            data: {
              name,
              pattern,
            },
          });
        }
      },
    };
  },
};
