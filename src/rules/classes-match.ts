import { ESLintUtils } from '@typescript-eslint/utils';

export default ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require identifiers of classes to match a specified regular expression',
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
      ClassDeclaration(node) {
        const { id } = node;
        if (id === null) {
          return;
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
      },
    };
  },
});
