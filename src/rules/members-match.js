/** @type {import('eslint').Rule.RuleModule} */
export default {
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
    /** @type {[ pattern: string ]} */
    const [pattern] = context.options;
    const regexp = new RegExp(pattern, 'u');
    return {
      // eslint-disable-next-line id-match/properties-match
      ClassDeclaration(node) {
        const {
          body: { body },
        } = node;
        for (const member of body) {
          if (member.type === 'StaticBlock') {
            continue;
          }
          const { key } = member;
          if (key.type !== 'Identifier' && key.type !== 'PrivateIdentifier') {
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
};
