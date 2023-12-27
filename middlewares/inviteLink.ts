export const generateRandomWords = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const magicLink = Math.random().toString(36).slice(2);
  return magicLink;
};
