export const handleErrors = (error: any) => {
  const { message, code } = error;
  const errors: any = { firstName: "", lastName: "", email: "", password: "" };

  if (code === 11000) {
    errors.email = "Email already registered";
    return errors;
  }
  if (message.includes("userAuth validation  failed")) {
    Object.values(error.errors).map((err: any) => {
      errors[err.properties.path] = err.properties.message;
    });
  }
};
