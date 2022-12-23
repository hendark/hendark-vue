function vnode(vm, tag, key, data, children, text) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text,
  };
}

export function createElement(vm, tag, data = {}, ...children) {
  let key = data?.key;
  if (key) {
    delete data.key;
  }
  return vnode(vm, tag, key, data, children);
}

export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}
