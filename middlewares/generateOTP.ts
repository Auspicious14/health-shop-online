export const generateOTP = () => {
  let otp;
  const otpDate = Date.now();
  const numbers: number = 123456;
  // const length: number = Math.floor(Math.random() * 2)
  const randomNumbers: number = Math.floor(numbers + Math.random() * 100000);
  otp = randomNumbers;
  return { otp, otpDate };
};
