import dayjs from "dayjs";

const useFormattedDate = () => {
  return (timestamp: string | number, format: string = "YYYY.MM.DD") => {
    if (!timestamp) return "-";
    return dayjs(Number(timestamp)).format(format);
  };
};

export default useFormattedDate;
