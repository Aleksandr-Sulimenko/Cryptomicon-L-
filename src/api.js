const API_KEY =
  "d4614669772e47a6b813f551a50d81607d94d3d82f9db18351fe1bd8b0c15d11";

const tickersHandlers = new Map();

//TODO: refactor to use URLSearchParams
export const loadTickers = () => {
  if (tickersHandlers.size === 0) {
    return;
  }
  fetch(
    ` https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys(),
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
    // `https://min-api.cryptocompare.com/data/pricemulti?fsym=${[
    //   ...tickersHandlers.keys(),
    // ].join(",")}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((r) => r.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) || [];
        handlers.forEach((fn) => fn(newPrice));
      });
    });
};

export const subscribeToTicker = (ticker, cd) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cd]);
};

export const unsubscribeFromTicker = (ticker, cd) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(
    ticker,
    subscribers.filter((fn) => fn !== cd)
  );
};
window.tickersHandlers = tickersHandlers;

setInterval(loadTickers, 10000);
