import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

export default ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require identifiers of enumerations to match a specified regular expression',
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
      TSEnumDeclaration(node) {
        const { id } = node;
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

        for (const member of node.body.members) {
          const { id } = member;
          if (id.type !== AST_NODE_TYPES.Identifier) {
            continue;
          }
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
        }
      },
    };
  },
});
