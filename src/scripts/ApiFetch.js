const MAX_CONCURRENT = 3;
const DELAY = 100;

let active = 0;
const queue = [];

function runNext() {
  if (active >= MAX_CONCURRENT || queue.length === 0) return;

  active++;
  const { url, options, resolve, reject } = queue.shift();

  fetch(url, options)
    .then(resolve)
    .catch(reject)
    .finally(() => {
      active--;
      setTimeout(runNext, DELAY);
    });
}

export function apiFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    queue.push({ url, options, resolve, reject });
    runNext();
  });
}
