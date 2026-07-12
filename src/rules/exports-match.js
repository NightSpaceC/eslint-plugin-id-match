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
      ExportSpecifier(node) {
        const { local, exported } = node;

        /** @type {string} */
        const localName = local.type === 'Identifier' ? local.name : local.value;
        /** @type {string} */
        const exportedName = exported.type === 'Identifier' ? exported.name : exported.value;

        if (exportedName === localName || regexp.test(exportedName)) {
          return;
        }
        report(node, exportedName);
      },
    };
  },
};
