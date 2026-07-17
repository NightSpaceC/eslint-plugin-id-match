import { AST_NODE_TYPES, ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

export default ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require identifiers of imported modules to match a specified regular expression',
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

    const report = (node: TSESTree.Node, name: string) => {
      context.report({
        node,
        messageId: 'notMatch',
        data: {
          name,
          pattern,
        },
      });
    };

    return {
      // eslint-disable-next-line id-match/properties-match
      ImportDefaultSpecifier(node) {
        const { local } = node;

        const localName = local.name;

        if (regexp.test(localName)) {
          return;
        }
        report(node, localName);
      },
      // eslint-disable-next-line id-match/properties-match
      ImportSpecifier(node) {
        const { imported, local } = node;

        const importedName = imported.type === AST_NODE_TYPES.Identifier ? imported.name : imported.value;
        const localName = local.name;

        if (localName === importedName || regexp.test(localName)) {
          return;
        }
        report(node, localName);
      },
    };
  },
});
