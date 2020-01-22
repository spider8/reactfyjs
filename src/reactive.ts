import { Watcher } from "./watcher";
import { Dep } from "./dep";

type KeyToDepMap = Map<any, Dep>;
const targetMap = new WeakMap<any, KeyToDepMap>();

const rawToProxy = new WeakMap<any, any>();
const proxyToRaw = new WeakMap<any, any>();

function isObject(data: any) {
  return typeof data === "object";
}

const handler = {
  get: function get(target: object, property: string, receiver) {
    let deps = targetMap.get(target);
    if (deps === undefined) {
      targetMap.set(target, (deps = new Map()));
    }

    let dep = deps.get(property);
    if (dep === undefined) {
      deps.set(property, (dep = new Dep()));
    }

    let result = Reflect.get(target, property);

    if (isObject(result)) {
      if (rawToProxy.has(result)) {
        return rawToProxy.get(result);
      }

      return reactive(result);
    }

    dep.depend();
    return result;
  },
  set: function set(target: object, property: string, value) {
    let deps = targetMap.get(target);
    let dep = deps?.get(property);

    const ret = Reflect.set(target, property, value);
    dep.notify();

    return ret;
  }
};

export function reactive(data: any): any {
  const proxy = new Proxy(data, handler);

  rawToProxy.set(data, proxy);
  proxyToRaw.set(proxy, data);

  return proxy;
}

export function watch(getter: Function, cb: Function): Function {
  const _watch = new Watcher(getter, cb);
  return function _unwatch() {
    _watch.unwatch();
  };
}

interface Ref<T> {
  value: T;
}

function ref<T>(value: T): Ref<T>;

function ref(value) {
  return reactive({ value });
}

function isFunction(func): func is Function {
  return typeof func === "function";
}

// read-only
export function computed<T>(getter: () => T): Readonly<Ref<Readonly<T>>>;

// // writable
// export function computed<T>(options: {
//   get: () => T;
//   set: (value: T) => void;
// }): Ref<T>;

export function computed(getter: () => any) {
  let _ref = ref(10);
  watch(getter, function setter() {
    console.log({ value: getter());
    _ref.value = getter();
  });

  return _ref;
}
