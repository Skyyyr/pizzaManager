import axios from "axios";
import {useEffect, useState} from "react";
import {Offcanvas} from "react-bootstrap";

function PizzaElement({pizzaName}) {
  const [ingredients, setIngredients] = useState();
  const [activeIngredients, setActiveIngredients] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [show, setShow] = useState(false);

  let activeIngredientList = [];

  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  async function handleGetPizzaDetails() {
    const resp = await axios.post('/pizzas', {
      'request': 'get',
      'pizza_name': pizzaName
    })
      .catch((e) => {
        console.log("Caught an error at handleGetPizzaDetails with " + e);
      });

    setIngredients(resp.data['found_ingredients']);
  }

  function displayActiveIngredients(list) {
    let htmlContent = [];
    if (list.length <= 0) {
      htmlContent.push(
        <div>
          None
        </div>
      );
    }
    list.forEach((ingredient) => {
      htmlContent.push(
        <div
          className={'col'}
          onClick={() => handleRemoveIngredient(ingredient)}
        >
          {ingredient}
        </div>
      );
    });

    return htmlContent;
  }

  function getActiveIngredients() {
    // let htmlContent = [];
    const ingredientsToList = ingredients.toString().split(',');

    activeIngredientList = ingredientsToList;
    setActiveIngredients(displayActiveIngredients(ingredientsToList));
  }

  async function getAllIngredients() {
    const resp = await axios.post('toppings', {
      'request': 'getall'
    })
      .catch((e) => {
        console.log("Caught error at getAllAvailableIngredients with " + e);
      });
    let htmlContent = [];
    resp.data['topping'].forEach((ingredient) => {
        htmlContent.push(
          <p
            onClick={() => handleAddIngredient(ingredient)}
          >
            {ingredient}
          </p>
        );
    });

    setAllIngredients(htmlContent);
  }

  function handleUpdatePizza() {
    handleOpen();
    getActiveIngredients();
    getAllIngredients().catch((e) => console.log("Error " + e));
  }
  
  function handleRemoveIngredient(ingredient) {
    const idx = activeIngredientList.indexOf(ingredient);
    if (idx !== -1) {
      activeIngredientList.splice(idx, 1);
    }

    setActiveIngredients(displayActiveIngredients(activeIngredientList));
  }

  function handleAddIngredient(ingredient) {
    if (activeIngredientList.includes(ingredient)) {
      alert("You cannot add an ingredient that is already included in the pizza.");
      return;
    }

    activeIngredientList.push(ingredient);
    setActiveIngredients(displayActiveIngredients(activeIngredientList));
  }

  async function handleDeletePizza() {
    const resp = await axios.post('pizzas', {
      'request': 'delete',
      'pizza_name': pizzaName
    })
      .catch((e) => {
        console.log("Caught an error at handleDeletePizza " + e);
      });

    if (resp.data['pizza'] === 'success') {
      window.location.reload();
    }
  }

  async function handleConfirmUpdate() {
    const userName = document.getElementById('name').value;
    if (userName.length <= 2) {
      alert("The name for your pizza must be 3 characters or longer.");
      return;
    }

    const list = [];
    activeIngredients.map((ingredient) => {
      list.push(ingredient.props.children);
    });

    if (list.length <= 2) {
      alert("You must have at least 2 ingredients to be able to make a pizza.");
      return;
    }

    let ingredientString = '';
    list.sort().forEach((ingredient, idx) => {
      ingredientString += ingredient;

      //To help with splitting later we want to only add a comma when there's a next
      if ((list.length - 1) > idx) {
        ingredientString += ",";
      }
    });

    const resp = await axios.post('pizzas', {
      'request': 'update',
      'pizza_name': pizzaName,
      'new_pizza_name': userName,
      'ingredients': ingredientString
    })
      .catch((e) => {
        console.log("Caught an error at handleConfirmUpdate " + e);
      });

    if (resp.data['pizza'] === 'success') {
      window.location.reload();
    } else {
      alert("Your pizza name or ingredients were not valid for updating. Ensure the name and ingredients are unique.");
    }
  }

  useEffect(() => {
    handleGetPizzaDetails()
      .catch((e) => {
        console.log("Caught an error at useEffect with " + e);
      });
  }, []);

  return (
    <div>
      <Offcanvas
        show={show}
        onHide={handleClose}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            Edit: {pizzaName}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {'Click on the active ingredients to remove them, and click on the available ingredients to add them.'}

          <br/>

          <button
            onClick={handleConfirmUpdate}
          >
            Update
          </button>

          <br/>

          {'Name: '}
          <input
            placeholder={'New Name'}
            id={'name'}
            defaultValue={pizzaName}
          />

          <br/>

          <div className={'row'}>
            {'Active ingredients: '}

            <br/>

            {activeIngredients}

            <hr/>

            {allIngredients}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <div className={'row'}>
        <div className={'col-4'}>
          {pizzaName}
        </div>

        <div className={'col-4'}>
          {ingredients}
        </div>

        <div className={'col-4'}>
          <button
            onClick={handleUpdatePizza}
          >
            Edit
          </button>
          <button
            onClick={handleDeletePizza}
          >
            Delete
          </button>
        </div>

        <hr/>

      </div>
    </div>
  )
}

export default PizzaElement