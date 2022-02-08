const API_KEY =
  "d4614669772e47a6b813f551a50d81607d94d3d82f9db18351fe1bd8b0c15d11";

//TODO: refactor to use URLSearchParams
export const loadTicker = (tickerName) =>
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${API_KEY}`
  ).then((r) => r.json());
