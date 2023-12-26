export const generateInviteLink = () => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const magicLink = Math.random().toString(letters?.length).slice(3);
  return magicLink;
};
