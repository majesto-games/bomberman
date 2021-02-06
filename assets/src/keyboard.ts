export function keyboard(keys: string[]) {
  const pressing = new Set();

  window.addEventListener("keydown", (event) => {
    if (keys.includes(event.key)) {
      event.preventDefault();
      pressing.add(event.key);
    }
  });

  window.addEventListener("keyup", (event) => {
    if (keys.includes(event.key)) {
      event.preventDefault();
      pressing.delete(event.key);
    }
  });

  return pressing;
}
