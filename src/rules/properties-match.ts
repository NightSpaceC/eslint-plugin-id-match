import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

export default ESLintUtils.RuleCreator.withoutDocs({
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
    const [pattern] = context.options as [string];
    const regexp = new RegExp(pattern, 'u');
    return {
      // eslint-disable-next-line id-match/properties-match
      ObjectExpression(node) {
        const { properties } = node;
        for (const property of properties) {
          if (property.type !== AST_NODE_TYPES.Property) {
            continue;
          }
          const { key } = property;
          if (key.type !== AST_NODE_TYPES.Identifier) {
            continue;
          }
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
});
