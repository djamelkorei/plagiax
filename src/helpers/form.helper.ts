export const FormHelper = {
  toFormData: (data: any): FormData => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      // @ts-ignore
      formData.append(key, value);
    });
    return formData;
  }
}
