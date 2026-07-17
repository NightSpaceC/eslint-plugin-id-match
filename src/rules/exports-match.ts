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
      ExportSpecifier(node) {
        const { local, exported } = node;

        const localName = local.type === AST_NODE_TYPES.Identifier ? local.name : local.value;
        const exportedName = exported.type === AST_NODE_TYPES.Identifier ? exported.name : exported.value;

        if (exportedName === localName || regexp.test(exportedName)) {
          return;
        }
        report(node, exportedName);
      },
    };
  },
});
