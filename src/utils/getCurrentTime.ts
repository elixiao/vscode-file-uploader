export function getCurrentTime() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const MM = leftpad(date.getMonth() + 1);
  const dd = leftpad(date.getDate());
  const HH = leftpad(date.getHours());
  const mm = leftpad(date.getMinutes());
  const ss = leftpad(date.getSeconds());
  return `${yyyy}/${MM}/${dd} ${HH}:${mm}:${ss}`;
}

function leftpad(val: number) {
  return val < 10 ? "0" + val : val;
}
