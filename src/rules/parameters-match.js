/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require identifiers of parameters to match a specified regular expression',
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

    /** @type {(node: import('estree').Identifier | import('estree').ObjectPattern | import('estree').AssignmentPattern | import('estree').ArrayPattern) => void} */
    // eslint-disable-next-line prefer-const
    let walk;

    /** @type {(node: import('estree').Identifier) => void} */
    const handleIdentifier = node => {
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

    /** @type {(node: import('estree').ObjectPattern) => void} */
    const handleObjectPattern = node => {
      for (const element of node.properties) {
        if (element.type === 'RestElement') {
          handleIdentifier(element.argument);
          continue;
        }
        walk(element.value);
      }
    };

    /** @type {(node: import('estree').ArrayPattern) => void} */
    const handleArrayPattern = node => {
      for (const element of node.elements) {
        if (element.type === 'RestElement') {
          handleIdentifier(element.argument);
          continue;
        }
        walk(element);
      }
    };

    walk = node => {
      const { type } = node;
      if (type === 'AssignmentPattern') {
        walk(node.left);
        return;
      }
      if (type === 'ObjectPattern') {
        handleObjectPattern(node);
        return;
      }
      if (type === 'ArrayPattern') {
        handleArrayPattern(node);
        return;
      }
      handleIdentifier(node);
    };

    return {
      // eslint-disable-next-line id-match/properties-match
      FunctionDeclaration(node) {
        for (const parameter of node.params) {
          if (parameter.type === 'RestElement') {
            handleIdentifier(parameter.argument);
            continue;
          }
          walk(parameter);
        }
      },
      // eslint-disable-next-line id-match/properties-match
      FunctionExpression(node) {
        for (const parameter of node.params) {
          if (parameter.type === 'RestElement') {
            handleIdentifier(parameter.argument);
            continue;
          }
          walk(parameter);
        }
      },
      // eslint-disable-next-line id-match/properties-match
      ArrowFunctionExpression(node) {
        for (const parameter of node.params) {
          if (parameter.type === 'RestElement') {
            handleIdentifier(parameter.argument);
            continue;
          }
          walk(parameter);
        }
      },
    };
  },
};
