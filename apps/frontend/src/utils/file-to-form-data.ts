export const fileToFormData = (name: string) => (file: File) => {
  const formData = new FormData();
  formData.append(name, file);
  return formData;
};
