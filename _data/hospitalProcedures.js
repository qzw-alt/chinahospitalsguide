const procedures = require('./procedures.js');
function fmt(r) {
  if (!r) return '';
  const lo = r.low ? '$' + Number(r.low).toLocaleString() : '';
  const hi = r.high ? '$' + Number(r.high).toLocaleString() : '';
  if (lo && hi && hi !== lo) return lo + '–' + hi;
  return hi || lo;
}
const map = {};
procedures.forEach(function(p) {
  (p.hospitals || []).forEach(function(hp) {
    if (!map[hp.hospital_id]) map[hp.hospital_id] = [];
    map[hp.hospital_id].push({ name: p.name, id: p.id, priceText: fmt(hp.price_range_usd), dept: hp.department || '' });
  });
});
module.exports = map;
