import { watch, reactive, computed } from "./reactive";

describe("reactive", () => {
  it("should be defined", () => {
    expect(reactive).toBeDefined();
  });
  it("should return a object", () => {
    expect(typeof reactive({})).toBe("object");
  });
  it("should return same data", () => {
    const data = { value: 1, nested: { nestedValue: 2 } };
    const proxy = reactive(data);

    expect(proxy.value).toBe(1);
    expect(proxy.nested.nestedValue).toBe(2);

    proxy.value = 3;

    expect(proxy.value).toBe(3);
    expect(data.value).toBe(3);

    proxy.nested.nestedValue = 4;

    expect(proxy.nested.nestedValue).toBe(4);
    expect(data.nested.nestedValue).toBe(4);
  });
  it("nesteded objects must be reactive", () => {
    let data = { value: { nestedValue: 0 } };
    let proxy = reactive(data);
    let counter = 0;
    const cb = jest.fn((value, oldValue) => {
      counter = value + 1;
    });

    const getter = jest.fn(() => proxy.value.nestedValue);

    const _watch = watch(getter, cb);

    expect(getter).toHaveBeenCalled();

    expect(cb).toHaveBeenCalled();
    expect(cb).toHaveBeenLastCalledWith(0, undefined);

    expect(data.value.nestedValue).toBe(0);
    expect(counter).toBe(1);

    proxy.value.nestedValue++;

    expect(getter).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenLastCalledWith(1, 0);

    expect(counter).toBe(2);
  });
});

describe("watch function", () => {
  let data;
  let counter;

  it("should be called when data change", () => {
    data = reactive({
      value: 0
    });
    counter = 0;
    watch(() => data.value, value => (counter = value + 1));

    expect(data.value).toBe(0);
    expect(counter).toBe(1);

    data.value++;

    expect(data.value).toBe(1);
    expect(counter).toBe(2);
  });

  it("should return a function that unwatch data", () => {
    data = reactive({ value: 0 });
    counter = 0;
    let unwatch = watch(() => data.value, value => (counter = value + 1));
    expect(typeof unwatch).toBe("function");

    expect(data.value).toBe(0);
    expect(counter).toBe(1);

    data.value++;

    expect(data.value).toBe(1);
    expect(counter).toBe(2);

    unwatch();

    data.value++;

    expect(data.value).toBe(2);
    expect(counter).toBe(2);
  });
  it("should accept pointers to as fist argument", () => {});
});

describe("computed function", () => {
  it("should be called when data change", () => {
    const data: { age: number } = reactive({ age: 20 });
    const agePlus = computed(() => data.age + 1);
    // expect(data.age).toBe(20);
    // expect(agePlus.value).toBe(21);
    // data.age++;
    // expect(data.age).toBe(21);
    // expect(agePlus.value).toBe(22);
  });

  it("should return a function that unwatch data", () => {
    // data = reactive({ value: 0 });
    // counter = 0;
    // let unwatch = watch(() => data.value, value => (counter = value + 1));
    // expect(typeof unwatch).toBe("function");
    // expect(data.value).toBe(0);
    // expect(counter).toBe(1);
    // data.value++;
    // expect(data.value).toBe(1);
    // expect(counter).toBe(2);
    // unwatch();
    // data.value++;
    // expect(data.value).toBe(2);
    // expect(counter).toBe(2);
  });
  it("should accept pointers to as fist argument", () => {});
});
