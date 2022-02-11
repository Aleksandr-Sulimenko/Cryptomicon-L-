const API_KEY =
  "d4614669772e47a6b813f551a50d81607d94d3d82f9db18351fe1bd8b0c15d11";

const tickersHandlers = new Map();
const socket = new WebSocket(
  ` wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);
const AGGREGATE_INDEX = "5";
socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
  } = JSON.parse(e.data);
  console.log(e.data);

  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }
  const handlers = tickersHandlers.get(currency) || [];
  handlers.forEach((fn) => fn(newPrice));
});

function sendToWebSocket(massege) {
  const stringifiedMassege = JSON.stringify(massege);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMassege);
    return;
  }
  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMassege);
    },
    { once: true }
  );
}

function subscribeToTickerONWs(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

function unsubscribeFromTickerONWs(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

export const subscribeToTicker = (ticker, cd) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cd]);
  subscribeToTickerONWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerONWs(ticker);
};
