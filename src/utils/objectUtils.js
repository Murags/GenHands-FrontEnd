/**
 * Removes properties with null or undefined values from an object.
 * @param {object} obj - The object to clean.
 * @returns {object} The cleaned object.
 */
export const cleanObject = (obj) => {
  const newObj = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};
