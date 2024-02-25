export const dateFormater = (date: string): string => {
  return new Date(date).toLocaleString("en-US", {
    timeStyle: "short",
  });
};
