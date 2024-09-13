export const createFormData = (data) => {
  const formData = new FormData();

  for (const key in data) {
    if (data.hasOwnProperty(key) && data[key] !== undefined) {
      const value = data[key];
      if (Array.isArray(value)) {
        value.forEach((element, index) => {
          formData.append(`${key}[${index}]`, element);
        });
      } else {
        formData.append(key, value);
      }
    }
  }

  return formData;
};
