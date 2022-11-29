import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import ToppingElement from "../Components/ToppingElement.jsx";

function Toppings() {
  const nav = useNavigate();

  const [category, setCategory] = useState('Sauce');
  const [foundToppings, setFoundToppings] = useState([
    <p>
      Loading...
    </p>
  ]);

  function newTopping() {
    nav('new');
  }

  function handleSetCategory(cat) {
    setCategory(cat);
  }

  async function handleToppingDisplay() {
    const resp = await axios.post('toppings', {
      'request': 'get',
      'category': category
    })
      .catch((e) => {
        console.log("Caught an error at handleToppingDisplay with error: " + e);
      });

    let htmlContent = [];
    const list = resp.data['topping'];

    if (list === 'None') {
      htmlContent.push(
        <div>
          <p>
            You don't have any toppings of this type.
          </p>
        </div>
      );
    } else {
      list.forEach((elem) => {
        htmlContent.push(
          <ToppingElement toppingName={elem}/>
        );
      });
    }

    setFoundToppings(htmlContent);
  }

  useEffect(() => {
    handleToppingDisplay()
      .catch((e) => {
        console.log("Couldn't load toppings with error " + e);
      });
  }, [category]);

  return (
    <div>
      <h1>
        Toppings Menu
      </h1>
      <p>
        Select a category below to view the toppings of that type, or add a new topping.
      </p>

      <br/>

      <ButtonGroup>
        <Button
          variant={'info'}
          onClick={newTopping}
        >
          Add New Topping
        </Button>
      </ButtonGroup>

      <hr/>
      <br/>

      <h4>
        {category}
      </h4>

      <ButtonGroup>
        <Button
          variant={'danger'}
          onClick={() => handleSetCategory('Sauce')}
          disabled={category === 'Sauce'}
        >
          Sauces
        </Button>

        <Button
          variant={'warning'}
          onClick={() => handleSetCategory('Cheese')}
          disabled={category === 'Cheese'}
        >
          Cheese
        </Button>

        <Button
          variant={'secondary'}
          onClick={() => handleSetCategory('Meat')}
          disabled={category === 'Meat'}
        >
          Meats
        </Button>

        <Button
          variant={'success'}
          onClick={() => handleSetCategory('Veggie')}
          disabled={category === 'Veggie'}
        >
          Veggies
        </Button>
      </ButtonGroup>

      <div>
        {foundToppings}
      </div>
    </div>
  )
}

export default Toppings