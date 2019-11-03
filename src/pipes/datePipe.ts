export const datePipe = (value: any) => {
  if (value) {
    if (value === parseInt(value).toString()) {
      value = parseInt(value);
    }
    const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
    if (seconds < 29) return "Just now";

    interface IntervalsInterface {
      [key: string]: number;
    }
    const intervals: IntervalsInterface = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
    let counter;
    for (const i in intervals) {
      counter = Math.floor(seconds / intervals[i]);
      if (counter > 0) {
        if (counter === 1) {
          return counter + " " + i + " ago";
        } else {
          return counter + " " + i + "s ago";
        }
      }
    }
  }
  return value;
};
