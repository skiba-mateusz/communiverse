export const formatDate = (
  dateStr: string,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "long",
    timeStyle: "short",
  }
) => {
  const fixedStr = dateStr.replace(/\.d{4,}/, (match) => match.slice(0, 4));
  const date = new Date(fixedStr);
  return new Intl.DateTimeFormat(navigator.language, options).format(date);
};
