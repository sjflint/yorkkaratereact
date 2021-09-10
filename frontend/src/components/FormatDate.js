const FormatDate = ({ date }) => {
  let d = new Date(date);
  let month = `0${d.getMonth() + 1}`;
  month.length === 3 && (month = month.substring(1, 3));
  const year = d.getFullYear();
  let day = `0${d.getDate()}`;
  day.length === 3 && (day = day.substring(1, 3));
  d = `${day}/${month}/${year}`;
  return d;
};

export default FormatDate;
