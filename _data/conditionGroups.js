// Category grouping for the /conditions/ index page.
// Grouped in JS rather than with Nunjucks selectattr, which silently returned every
// item for every category and rendered all 19 conditions under each heading.
const conditions = require('./conditions.js');

const CATEGORY_ORDER = [
  ['oncology', 'Oncology & Cancer'],
  ['cardiology', 'Heart & Circulation'],
  ['neurosurgery', 'Neurosurgery'],
  ['neurology', 'Neurology'],
  ['orthopedics', 'Orthopedics & Spine'],
  ['ophthalmology', 'Eye Surgery'],
  ['obgyn', "Fertility & Women's Health"],
  ['dental', 'Dental']
];

module.exports = CATEGORY_ORDER
  .map(function (pair) {
    return {
      key: pair[0],
      label: pair[1],
      items: conditions.filter(function (c) { return c.category === pair[0]; })
    };
  })
  .filter(function (group) { return group.items.length > 0; });
