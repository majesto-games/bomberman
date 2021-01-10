export function keyboard() {
  const pressing = new Set();

  window.addEventListener("keydown", ({ key }) => 
    pressing.add(key)
  );
  
  window.addEventListener("keyup", ({ key }) => 
    pressing.delete(key)
  );

  return pressing;
}