/** @type {import('eslint').Rule.RuleModule} */
export default {
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
    /** @type {[ pattern: string ]} */
    const [pattern] = context.options;
    const regexp = new RegExp(pattern, 'u');

    const report = (node, name) => {
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

        /** @type {string} */
        const importedName = imported.type === 'Identifier' ? imported.name : imported.value;
        const localName = local.name;

        if (localName === importedName || regexp.test(localName)) {
          return;
        }
        report(node, localName);
      },
    };
  },
};
