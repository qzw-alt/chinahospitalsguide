// Category grouping for the /procedures.html quick-reference page.
// Grouped in JS rather than with Nunjucks selectattr, which silently returned every
// item for every category (same trap documented in conditionGroups.js).
const procedures = require('./procedures.js');

const CATEGORY_ORDER = [
  ['oncology', 'Cancer & Cell Therapy'],
  ['cardiology', 'Heart & Circulation'],
  ['orthopedics', 'Orthopedics & Spine'],
  ['ophthalmology', 'Eye Surgery'],
  ['obgyn', "Fertility & Women's Health"],
  ['dental', 'Dental'],
  ['neurosurgery', 'Neurosurgery & Neurology'],
  ['plastic', 'Plastic & Aesthetic']
];

module.exports = CATEGORY_ORDER
  .map(function (pair) {
    return {
      key: pair[0],
      label: pair[1],
      items: procedures.filter(function (p) { return p.category === pair[0]; })
    };
  })
  .filter(function (group) { return group.items.length > 0; });
