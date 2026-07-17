import { AST_NODE_TYPES, ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

import type { BindPattern } from '../types.ts';

export default ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require identifiers of variables to match a specified regular expression',
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

    // eslint-disable-next-line prefer-const
    let walk: (node: BindPattern) => void;

    const handleIdentifier = (node: TSESTree.Identifier) => {
      const { name } = node;
      if (regexp.test(name)) {
        return;
      }
      context.report({
        node,
        messageId: 'notMatch',
        data: {
          name,
          pattern,
        },
      });
    };

    const handleObjectPattern = (node: TSESTree.ObjectPattern) => {
      for (const element of node.properties) {
        if (element.type === AST_NODE_TYPES.RestElement) {
          handleIdentifier(element.argument as TSESTree.Identifier);
          continue;
        }
        walk(element.value as TSESTree.Identifier | TSESTree.ObjectPattern | TSESTree.ArrayPattern);
      }
    };

    const handleArrayPattern = (node: TSESTree.ArrayPattern) => {
      for (const element of node.elements) {
        if (element === null) {
          continue;
        }
        if (element.type === AST_NODE_TYPES.RestElement) {
          handleIdentifier(element.argument as TSESTree.Identifier);
          continue;
        }
        walk(element as TSESTree.Identifier | TSESTree.ObjectPattern | TSESTree.ArrayPattern);
      }
    };

    walk = node => {
      const { type } = node;
      if (type === AST_NODE_TYPES.AssignmentPattern) {
        walk(node.left);
        return;
      }
      if (type === AST_NODE_TYPES.ObjectPattern) {
        handleObjectPattern(node);
        return;
      }
      if (type === AST_NODE_TYPES.ArrayPattern) {
        handleArrayPattern(node);
        return;
      }
      handleIdentifier(node);
    };

    return {
      // eslint-disable-next-line id-match/properties-match
      VariableDeclarator(node) {
        walk(node.id);
      },
    };
  },
});
