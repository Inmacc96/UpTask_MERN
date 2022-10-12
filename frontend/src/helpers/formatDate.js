export const formatDate = (date) => {
  const newDate = new Date(date);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return newDate.toLocaleString("en-UK", options);
};
