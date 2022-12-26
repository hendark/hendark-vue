import { mergeOptions } from "../util/options";

export function initGlobalAPI(Vue) {
  Vue.options = {};
  Vue.mixin = function (mixin) {
    console.log(this.options);
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
}
