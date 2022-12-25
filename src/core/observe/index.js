import { newArrProto } from "./array";
import Dep from "./dep";

class Observer {
  constructor(data) {
    //把当前Observer实例赋值到data上，调用newArrProto时，data是其的this指针指向
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false, //不枚举，不让循环到
    });
    if (Array.isArray(data)) {
      //重写数组方法
      data.__proto__ = newArrProto;

      this.observerArray(data);
    } else {
      // Object.defineProperty只能劫持已经存在的
      this.walk(data);
    }
  }
  walk(data) {
    //循环对象，属性依次劫持
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }
  observerArray(data) {
    data.forEach((item) => observer(item));
  }
}

export function defineReactive(target, key, value) {
  observer(value); //递归对所有对象劫持
  let dep = new Dep();
  Object.defineProperty(target, key, {
    get() {
      if (Dep.target) {
        dep.depend();
      }
      console.log('---------get-------',value);
      return value;
    },
    set(newValue) {
      console.log('---------set-------',newValue)
      if (newValue === value) {
        return;
      }
      observer(newValue);
      value = newValue;
      dep.notify();
    },
  });
}

export function observer(data) {
  if (typeof data !== "object" || data == null) {
    return;
  }

  //__ob__表示被代理过,也可以是个监测标识
  if (data.__ob__ instanceof Observer) {
    return data.__ob__;
  }

  return new Observer(data);
}
