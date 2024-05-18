import React, { useState, useEffect } from "react";
import "../api";
import { EXCHANGE_RATE_API_KEY, EXCHANGE_RATE_URL } from "../api";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import CurrencyInput from "react-currency-input-field";

const Converter = () => {
  const [rates, setRates] = useState({});
  const [ratesFetched, setRatesFetched] = useState(false);
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("JPY");
  const [output, setOutput] = useState(0);

  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click); //reverses false click state set

  //create function to fetch the rates from the api
  const getRates = async () => {
    //fetch the data from the api
    const response = await fetch(
      `${EXCHANGE_RATE_URL}${EXCHANGE_RATE_API_KEY}/latest/USD`
    ).then((response) => response.json());
    // Save the rates in the state
    if (response.result === "success") {
      setRates(response.conversion_rates);
      setRatesFetched(true);
    }
  };

  //call the getRates() funtion using useEffect() to access data
  useEffect(() => {
    getRates();
  }, []);

  const calculateOutput = async (e) => {
    //prevent the page from refreshing on submit to ensure output displays
    e.preventDefault();
    // fetch the chosen currency from rates
    const response = await fetch(
      `${EXCHANGE_RATE_URL}${EXCHANGE_RATE_API_KEY}/latest/${fromCurrency}`
    ).then((response) => response.json());
    const fetchedRates = response.conversion_rates;
    // calculate and set where to store the results
    const CurrencyRate = fetchedRates[toCurrency];
    const result = parseFloat(amount) * CurrencyRate;
    setOutput(result);
  };

  const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat('en-US', {style: 'currency', currency}).format(value);
  }

  return (
    <div>
      <h1>Global Currency Converter</h1>
      <form className="converterContainer" onSubmit={calculateOutput}>
        <div className="formGroup">
          <label htmlFor="amount">Amount:</label>
          <CurrencyInput
            name="amount"
            id="amount"
            //create handler to receive and handle the amount value
            onValueChange={(value) => setAmount(value)}
            value={amount}
            //configure the initial display to reflect USD
            intlConfig={{locale: "en-US", currency: fromCurrency}}
            allowDecimals={true}
            allowNegativeValue={false}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="currency1">Convert from: </label>
          <select
            name="currency1"
            id="currency1"
            //create handler to set from currency value
            onChange={(e) => setFromCurrency(e.target.value)}
            value={fromCurrency}
          >
            {ratesFetched ? (
              //map the rates and currency to the select dropdown  from the index. 
              Object.entries(rates).map(([currency, rate]) => (
                <option key={currency} value={currency}>
                  {currency} - {rate}
                </option>
              ))
            ) : (
              <option defaultValue>USD</option>
            )}
          </select>
        </div>
        <div className="formGroup">
          <label htmlFor="currency2">Convert to: </label>
          <select
            name="currency2"
            id="currency2"
            //create handler to set to currency value
            onChange={(e) => setToCurrency(e.target.value)}
            value={toCurrency}
          >
            {ratesFetched ? (
              Object.entries(rates).map(([currency, rate]) => (
                <option key={currency} value={currency}>
                  {currency} - {rate}
                </option>
              ))
            ) : (
              <option defaultValue>JPY</option>
            )}
          </select>
        </div>
        <div className="btn-container">
          <button type="submit">Convert</button>
        </div>
        <div className="conversion">
          <p>
            Converted Rate: <br />
            <span className="output">{formatCurrency(output, toCurrency)}</span>
          </p>
        </div>
      </form>
      <div className="ratesContainer">
        <Accordion allowZeroExpanded>
          <AccordionItem>
            <AccordionItemHeading
              className="accordionHeading">
              <AccordionItemButton style={{ cursor: "pointer" }}>
                              <div onClick={handleClick}>
                  <i className={click ? "fas fa-chevron-down" : "fas fa-chevron-right"} />
                  <h2 style={{ textAlign: "center" }}>All Currency Rates</h2>
                  <p style={{ textAlign: "center" }}>
                    Click here to view current rates
                  </p>
                  <small>
                    <p style={{ marginTop: "-15px", textAlign: "center" }}>
                      *Rates based on USD*
                    </p>
                  </small>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel style={{ marginBottom: '50px' }}>
              <ul className="rateList" style={{ textDecoration: "none" }}>
                {ratesFetched &&
                  Object.entries(rates).map(([currency, rate], index) => (
                    <li key={index} className="rateItems">
                      <span className="currencyKey">{currency}</span>
                      <span className="currencyValue">{rate}</span>
                    </li>
                  ))}
              </ul>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Converter;
