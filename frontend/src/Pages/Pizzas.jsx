import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import PizzaElement from "../Components/PizzaElement.jsx";

function Pizzas() {
  const nav = useNavigate();

  const [pizzas, setPizzas] = useState([
    <p>
      Loading...
    </p>
  ]);

  function handleNewPizza() {
    nav('new');
  }

  async function getAllPizzas() {
    const resp = await axios.get('/pizzas')
      .catch((e) => {
        console.log("Caught an error at getAllPizzas with " + e);
      });

    let htmlContent = [];
    if (resp.data['pizza'] === 'success') {
      const foundPizzas = resp.data['pizza_list'];
      foundPizzas.forEach((pizza) => {
        htmlContent.push(
          <PizzaElement pizzaName={pizza} />
        )
      });


    } else {
      htmlContent.push(
        <p>
          You don't have any pizzas made yet.
        </p>
      )
    }
    setPizzas(htmlContent);
  }

  useEffect(() => {
    getAllPizzas()
      .catch((e) => {
        console.log("Cannot load all pizzas. " + e)
      });
  }, [])

  return (
    <div>
      <h1>
        Pizzas Menu
      </h1>
      <p>
        Below is a list of all your currently created pizzas if there are any, and an option to make a new pizza.
      </p>

      <br/>
      <hr/>

      <button
        onClick={handleNewPizza}
      >
        New Pizza
      </button>

      <br/>
      <hr/>

      <div className={'row'}>
        <div className={'col'}>
          {pizzas}
        </div>
      </div>
    </div>
  )
}

export default Pizzas