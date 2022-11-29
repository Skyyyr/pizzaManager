import {useEffect, useState} from "react";
import {ListGroup} from "react-bootstrap";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function NewPizza() {
  const nav = useNavigate();

  const [currentIngredients, setCurrentIngredients] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([
      'Loading...'
  ]);

  // This is used as a helper variable to establish our active ingredient listing
  let currentIngredientsList = [];

  function addToppingToList(topping) {

    if (currentIngredientsList.includes(topping)) {
      alert('You cannot add the same topping twice.');
      return;
    }

    currentIngredientsList.push(topping);

    handleIngredientDisplay(currentIngredientsList);
  }

  function removeToppingFromList(topping) {
    const toppingName = topping;
    let tempList = currentIngredientsList;
    const idx = currentIngredientsList.indexOf(toppingName);
    if (idx !== -1) {
      tempList.splice(idx, 1);
    }

    handleIngredientDisplay(tempList);
  }

  async function getAllAvailableIngredients() {
    const resp = await axios.post('toppings', {
      'request': 'getall'
    })
      .catch((e) => {
        console.log("Caught error at getAllAvailableIngredients with " + e);
      });
    let htmlContent = [];
    if (resp.data['topping'] === 'None') {
     htmlContent.push(
        <div>
          <p>
            You don't have any toppings.
          </p>
        </div>
      );
    } else {
      resp.data['topping'].forEach((elem) => {
        htmlContent.push(
          <div className={'row'}>

            <hr/>

            <div className={'col-lg-8 col-sm'}>
              <p>
                {elem}
              </p>
            </div>

            <div className={'col-lg-4 col-sm'}>
              <button
                onClick={() => addToppingToList(elem)}
              >
                Add Topping
              </button>
            </div>

          </div>
        );
      });
    }
    setAvailableIngredients(htmlContent);
  }

  function handleIngredientDisplay(list) {
    let htmlContent = [];

    if (list.length <= 0) {
      htmlContent.push(
        <ListGroup.Item>
          None
        </ListGroup.Item>
      );
    }

    list.forEach((elem) => {
      if (elem !== 'None') {
        htmlContent.push(
          <ListGroup.Item
            onClick={() => removeToppingFromList(elem)}
          >
            {elem}
          </ListGroup.Item>
        );
      }
    });

    setCurrentIngredients(htmlContent);
  }

  function handleCancel() {
    nav('/pizzas');
  }

  async function handleCreatePizza() {
    const pizzaName = document.getElementById('name').value;

    if (pizzaName.length <= 2) {
      alert("The name for your pizza is not valid for entry. Please try again.");
      return;
    }

    if (currentIngredients.length <= 1) {
      alert("You need to have at least two ingredients to make a pizza.");
      return;
    }

    let ingredientNames = [];
    currentIngredients.forEach((e) => {
      const ingredientName = e.props.children;
      ingredientNames.push(ingredientName);
    })

    //This'll ensure the ingredients will be put in the same order each time when applied to the db to prevent dups
    let ingredientString = '';
    ingredientNames.sort().forEach((ingredient, idx) => {
      ingredientString += ingredient;

      //To help with splitting later we want to only add a comma when there's a next
      if ((ingredientNames.length - 1) > idx) {
        ingredientString += ","
      }
    });

    const resp = await axios.post('pizzas', {
      'request': 'set',
      'pizza_name': pizzaName,
      'ingredients': ingredientString
    });

    if (resp.data['pizza'] === 'success') {
      nav('/pizzas');
    } else {
      alert("Your pizza has already been made either with this name, or the listed ingredients.");
    }
  }

  useEffect(() => {
    handleIngredientDisplay(currentIngredientsList);
    getAllAvailableIngredients()
      .catch((e) => {
        console.log("Caught error at useEffect with " + e);
      });
  }, []);

  return (
    <div>
      <h2>
        Add your new Pizza
      </h2>
      <p>
        Create a unique name, and ingredients for your pizza. <br/>
        While creating your pizza you can click on the added toppings to remove them.
      </p>

      <br/>
      <hr/>

      <div className={'row'}>
        <div className={'col-lg-1 col-sm'}>
          <p>
            Name:
          </p>
        </div>

        <div className={'col-lg-7 col-sm'}>
          <input
            placeholder={'Pizza Name'}
            id={'name'}
          />
        </div>

        <div className={'col-lg-2 col-sm'}>
          <button
            onClick={handleCreatePizza}
          >
            Create
          </button>
        </div>

        <div className={'col-lg-2 col-sm'}>
          <button
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>

      <br/>

      <ListGroup variant={'flush'}>
        <ListGroup.Item>
          {'Active List of Ingredients '}
        </ListGroup.Item>
        {currentIngredients}
      </ListGroup>

      <br/>
      {'Available Ingredients to select from: '}
      {availableIngredients}
    </div>
  )
}

export default NewPizza