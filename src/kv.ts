
const ENV_GM = (typeof GM != 'undefined');

export function getValue<T>(key: string, defaultValue?: T): Promise<T> {
  if (ENV_GM) {
    return GM.getValue(key, defaultValue);
  } else {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (value) => {
        resolve(value[key] ?? defaultValue);
      });
    });
  }
}

export function setValue(key: string, value: any): Promise<void> {
  if (ENV_GM) {
    return GM.setValue(key, value);
  } else {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  }
}
