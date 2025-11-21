export const FormHelper = {
  toFormData: (data: {
    [key: string]: number | string | boolean | number[] | string[] | boolean[];
  }): FormData => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      // @ts-expect-error
      formData.append(key, value);
    });
    return formData;
  },
};
