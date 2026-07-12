import importsMatch from './rules/imports-match.js';
import varsMatch from './rules/vars-match.js';
import functionsMatch from './rules/functions-match.js';
import propertiesMatch from './rules/properties-match.js';
import classesMatch from './rules/classes-match.js';
import membersMatch from './rules/members-match.js';
import parametersMatch from './rules/parameters-match.js';
import exportsMatch from './rules/exports-match.js';

export default {
  rules: {
    'imports-match': importsMatch,
    'vars-match': varsMatch,
    'functions-match': functionsMatch,
    'properties-match': propertiesMatch,
    'classes-match': classesMatch,
    'members-match': membersMatch,
    'parameters-match': parametersMatch,
    'exports-match': exportsMatch,
  },
};
