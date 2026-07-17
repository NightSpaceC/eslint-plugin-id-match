import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

export default ESLintUtils.RuleCreator.withoutDocs({
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
    const [pattern] = context.options as [string];
    const regexp = new RegExp(pattern, 'u');

    const tryReport = (id: TSESTree.Identifier) => {
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
        if (id === null) {
          return;
        }
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
});
