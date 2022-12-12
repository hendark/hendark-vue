class Observer {
  constructor(data) {
    // Object.defineProperty只能劫持已经存在的
    this.walk(data);
  }
  walk(data) {
    //循环对象，属性依次劫持
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }
}

export function defineReactive(target, key, value) {
  observer(value);//递归对所有对象劫持
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue === value) {
        return;
      }
      value = newValue;
    },
  });
}

export function observer(data) {
  if (typeof data !== "object" || data == null) {
    return;
  }

  return new Observer(data);
}
