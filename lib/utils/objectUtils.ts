export function removeEmptyProperties<T extends any>(obj: Record<keyof any, any>) {
  const newObj = { ...obj }; // 创建一个新的对象，避免直接修改原始对象

  Object.keys(newObj).forEach((key) => {
    if (['', undefined, null].includes(newObj[key])) {
      delete newObj[key];
    }
  });

  return newObj as T;
}

export function isEmptyObject(obj: Record<keyof any, any>) {
  return Object.keys(obj).length === 0;
}
