//重写数组方法

const oldArrProto = Array.prototype;
export const newArrProto = Object.create(oldArrProto);

let methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"];

methods.forEach((method) => {
  newArrProto[method] = function (...rest) {
    //函数劫持，AOP,this指向调用方arr.push也就是data
    const arr = oldArrProto[method].call(this, ...rest);

    let inserted;
    let ob = this.__ob__;
    //新值监控
    switch (method) {
      case "push":
      case "unshift":
        inserted = rest;
        break;
      case "splice":
        inserted = rest.slice(2);
        break;

      default:
        break;
    }
    if (inserted) {
      ob.observerArray(inserted);
    }

    return arr;
  };
});
