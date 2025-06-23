export const isValidURL = (url) =>
  /^(https?:\/\/)[^\s/$.?#].[^\s]*$/.test(url);

export const isValidShortcode = (code) =>
  /^[a-zA-Z0-9]{4,12}$/.test(code);
