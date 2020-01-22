import { popTarget, pushTarget, Dep } from "./dep";

// See https://github.com/vuejs/vue/blob/be9ac624c81bb698ed75628fe0cbeaba4a2fc991/src/core/observer/watcher.js
// for full implementation

export class Watcher {
  deps: Set<Dep>;
  value: any;

  getter: () => any;
  cb?: (value: any, oldValue?: any) => any;

  constructor(getter, cb) {
    this.getter = getter; // function that returns a value based on reactive properties
    this.cb = cb; // function that is run on value updates, and is passed value and old value
    this.deps = new Set<Dep>();
    this.value = this.get();
    this.cb(this.value, undefined);
  }

  get(): any {
    pushTarget(this); // from dep.js
    const value = this.getter();
    popTarget(); // from dep.js

    return value;
  }

  addDep(dep: Dep): void {
    this.deps.add(dep);
    dep.addSub(this);
  }

  unwatch(): void {
    this.deps.forEach(dep => dep.delSub(this));
    this.deps = new Set<Dep>();
  }

  update(): void {
    const oldValue = this.value;
    this.value = this.get();
    this.cb(this.value, oldValue);
  }
}
