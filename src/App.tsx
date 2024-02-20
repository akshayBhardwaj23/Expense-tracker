import { FormEvent, useEffect, useState } from "react";
import "./App.css";

interface Props {
  _id: string;
  name: string;
  description: string;
  datetime: string;
  price: number;
}

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState<Props[]>([]);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, [flag]);

  async function getTransactions() {
    const url = import.meta.env.VITE_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }

  const deleteTransactions = (index: string) => {
    const url = import.meta.env.VITE_API_URL + "/transaction/" + index;
    console.log(url);
    fetch(url, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    })
      .then((res) => {
        res.json().then((json) => {
          console.log("Result: ", json);
          setFlag((prev) => !prev);
        });
      })
      .catch((err) => {
        console.error("There was some problem: ", err);
      });
  };

  /**Method to add transactions by calling endpoint */
  const addNewTransaction = (ev: FormEvent) => {
    ev.preventDefault();
    /**To import variable from .env file */
    const url = import.meta.env.VITE_API_URL + "/transaction";
    console.log(url);
    const price = name.split(" ")[0];
    /**provides a JavaScript interface for accessing and manipulating
     *  parts of the protocol, such as requests and responses */
    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    }).then((res) => {
      res.json().then((json) => {
        setName("");
        setDescription("");
        setDatetime("");
        console.log("Result: ", json);
        /**Trigger the useEffect Hook */
        setFlag((prev) => !prev);
      });
    });
  };
  /**aggregating all the transactions price */
  let balance: number = 0;
  balance = transactions.reduce((a: number, transaction: any) => {
    return a + (transaction.price ? transaction.price : 0);
  }, 0);
  /**Splitting fraction value */
  const val = balance.toString().split(".");

  return (
    <>
      <main>
        <h1>
          ${val[0]}
          <span>.{val[1]}</span>
        </h1>
        <form onSubmit={addNewTransaction}>
          <div className="basic">
            <input
              type="text"
              value={name}
              required
              onChange={(ev) => setName(ev.target.value)}
              placeholder={"+/- (Product name): e.g., -300 Shoes"}
            ></input>
            <input
              type="datetime-local"
              value={datetime}
              required
              onChange={(ev) => setDatetime(ev.target.value)}
            ></input>
          </div>
          <div className="description">
            <input
              type="text"
              required
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              placeholder="descripton"
            />
          </div>
          <button type="submit">Add new transaction</button>
        </form>
        <div className="transactions">
          {transactions.length > 0 &&
            transactions.map((transaction, key) => (
              <div key={key} className="transaction">
                <div className="left">
                  <div className="name">{transaction.name}</div>
                  <div className="description">{transaction.description}</div>
                </div>
                <div className="right">
                  <div
                    className={
                      "price " + (transaction.price < 0 ? "red" : "green")
                    }
                  >
                    {transaction.price}
                  </div>
                  <div className="datetime">{transaction.datetime}</div>
                </div>
                <div className="btn">
                  <button
                    className="button-56"
                    onClick={() => deleteTransactions(transaction._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </main>
    </>
  );
}

export default App;
