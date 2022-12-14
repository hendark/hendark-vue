import { observer } from "../observe/index";

export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
}
function initData(vm) {
  let data = vm.$options.data;
  data = typeof data === "function" ? data.call(vm) : data;

  vm._data = data; //将劫持的get set放在_data上
  //数据劫持，vue2 使用了defineProperty
  observer(data);

  Object.keys(data).forEach((key) => Proxy(vm, "_data", key));
}
  function Proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key];
    },
    set(newValue) {
      vm[target][key] = newValue;
    },
  });
}
