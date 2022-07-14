function pad(num, padding = 2) {
  let requiredLength = Math.max(padding - String(num).length, 0);
  return "0".repeat(requiredLength) + String(num);
}

export default function showTime(time, showTime = true) {
  try {
    time = new Date(time);
    let date = `${time.getFullYear()}-${pad(time.getMonth() + 1)}-${pad(
      time.getDate()
    )}`;
    let stime = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(
      time.getSeconds()
    )}`;
    let result = "";
    result += date + " ";
    if (showTime) result += stime;
    return result;
  } catch (err) {
    console.log(err);
    return "";
  }
}
