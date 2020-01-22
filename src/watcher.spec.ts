import { Watcher } from "./watcher";

const voidFn = () => {};

describe("Watcher", () => {
  let getter;
  let cb;
  let watch;

  beforeEach(() => {
    getter = jest.fn();
    cb = jest.fn();
    watch = new Watcher(getter, cb);
  });
  it("should be defined", () => {
    expect(new Watcher(voidFn, voidFn)).toBeDefined();
  });
  it("should call getter and callback once when insstance", () => {
    expect(getter.mock.calls.length).toBe(1);
    expect(cb.mock.calls.length).toBe(1);
  });

  it("should call getter and callback when updated method", () => {
    watch.update();
    expect(getter.mock.calls.length).toBe(2);
    expect(cb.mock.calls.length).toBe(2);
  });
});
