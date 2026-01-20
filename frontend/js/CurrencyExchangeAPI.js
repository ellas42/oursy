const API_KEY = "7e316e57f52940d6822e2b66495438ad";
const BASE_CURRENCY = "IDR";
const SUPPORTED = ["USD", "EUR", "GBP", "AUD"];

const selector = document.getElementById("currency-selector");

async function getRates() {
  const cached = localStorage.getItem("exchangeRates");
  const cachedTime = localStorage.getItem("exchangeRatesTime");

  // cache for 6 hours
  if (cached && cachedTime && Date.now() - cachedTime < 6 * 60 * 60 * 1000) {
    return JSON.parse(cached);
  }

  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`
  );

  const data = await res.json();

  if (data.result !== "success") {
    throw new Error("Failed to fetch exchange rates");
  }

  const rates = data.conversion_rates;

  localStorage.setItem("exchangeRates", JSON.stringify(rates));
  localStorage.setItem("exchangeRatesTime", Date.now());

  return rates;
}

function updatePrices(currency, rates) {
  document.querySelectorAll(".price").forEach(el => {
    const basePrice = Number(el.dataset.priceIdr);
    const converted =
      currency === BASE_CURRENCY
        ? basePrice
        : basePrice * rates[currency];

    el.textContent = new Intl.NumberFormat("en", {
      style: "currency",
      currency
    }).format(converted);
  });
}

// Init
(async function initCurrency() {
  try {
    const rates = await getRates();

    selector.addEventListener("change", () => {
      const currency = selector.value;
      localStorage.setItem("currency", currency);
      updatePrices(currency, rates);
    });

    // restore saved currency
    const saved = localStorage.getItem("currency") || BASE_CURRENCY;
    selector.value = saved;
    updatePrices(saved, rates);

    window.updatePricesAfterRender = function () {
  const currency = localStorage.getItem("currency") || "IDR";
  if (!window.exchangeRates) return;

  document.querySelectorAll(".price").forEach(el => {
    const basePrice = Number(el.dataset.priceIdr);
    const rate = currency === "IDR" ? 1 : window.exchangeRates[currency];
    const converted = basePrice * rate;

    el.textContent = new Intl.NumberFormat("en", {
      style: "currency",
      currency
    }).format(converted);
  });
};


  } catch (err) {
    console.error(err);
  }
})();