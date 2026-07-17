import type { TSESTree } from '@typescript-eslint/utils';

export type BindPattern = TSESTree.Identifier | TSESTree.ObjectPattern | TSESTree.AssignmentPattern | TSESTree.ArrayPattern;
