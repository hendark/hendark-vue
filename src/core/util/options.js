const strats = {};
const LIFECYCLE = ["beforeCreate", "created"];
LIFECYCLE.forEach((hook) => {
  strats[hook] = function (p, c) {
    if (c) {
      if (p) {
        return p.concat(c);
      }
      return [c];
    }
    return p;
  };
});
export function mergeOptions(parent, child) {
  const options = {};
  for (const key in parent) {
    mergeField(key);
  }
  for (const key in child) {
    if (!parent.hasOwnProperty(key)) mergeField(key);
  }
  function mergeField(key) {
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key]);
    } else {
      options[key] = child[key] || parent[key];
    }
  }
  return options;
}
