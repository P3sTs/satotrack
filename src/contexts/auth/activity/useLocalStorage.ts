
// Helper for managing localStorage
export const useLocalStorage = () => {
  const saveToLocalStorage = (key: string, value: any): void => {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : value.toString());
    } catch (e) {
      console.error(`Error saving ${key} to localStorage:`, e);
    }
  };

  const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? (typeof defaultValue === 'number' ? Number(storedValue) as unknown as T : storedValue as unknown as T) : defaultValue;
    } catch (e) {
      console.error(`Error loading ${key} from localStorage:`, e);
      return defaultValue;
    }
  };

  const removeFromLocalStorage = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing ${key} from localStorage:`, e);
    }
  };

  return { saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage };
};
