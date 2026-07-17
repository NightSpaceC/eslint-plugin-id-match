import importsMatch from './rules/imports-match.ts';
import varsMatch from './rules/vars-match.ts';
import functionsMatch from './rules/functions-match.ts';
import propertiesMatch from './rules/properties-match.ts';
import classesMatch from './rules/classes-match.ts';
import membersMatch from './rules/members-match.ts';
import interfacesMatch from './rules/interfaces-match.ts';
import typeAliasMatch from './rules/type-aliases-match.ts';
import enumerationsMatch from './rules/enumerations-match.ts';
import parametersMatch from './rules/parameters-match.ts';
import exportsMatch from './rules/exports-match.ts';

export default {
  rules: {
    'imports-match': importsMatch,
    'vars-match': varsMatch,
    'functions-match': functionsMatch,
    'properties-match': propertiesMatch,
    'classes-match': classesMatch,
    'interfaces-match': interfacesMatch,
    'members-match': membersMatch,
    'type-aliases-match': typeAliasMatch,
    'enumerations-match': enumerationsMatch,
    'parameters-match': parametersMatch,
    'exports-match': exportsMatch,
  },
};
