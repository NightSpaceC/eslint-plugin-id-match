import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

export default ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require identifiers of members to match a specified regular expression',
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
        for (const member of node.body.body) {
          if (member.type === AST_NODE_TYPES.StaticBlock || member.type === AST_NODE_TYPES.TSIndexSignature) {
            continue;
          }
          const { key } = member;
          if (key.type !== AST_NODE_TYPES.Identifier && key.type !== AST_NODE_TYPES.PrivateIdentifier) {
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

      // eslint-disable-next-line id-match/properties-match
      TSInterfaceDeclaration(node) {
        for (const member of node.body.body) {
          if (member.type !== AST_NODE_TYPES.TSPropertySignature && member.type !== AST_NODE_TYPES.TSMethodSignature) {
            continue;
          }
          const { key } = member;
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
