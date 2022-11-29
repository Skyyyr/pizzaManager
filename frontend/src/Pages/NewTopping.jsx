import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function NewTopping() {
  const nav = useNavigate();

  const [category, setCategory] = useState('Select a category');

  function handleCategory(cat) {
    setCategory(cat);
  }

  function handleCancel() {
    nav('/');
  }

  async function handleNewTopping() {
    const toppingInput = document.getElementById('name').value;
    if (toppingInput === '' || toppingInput.length < 3)
    {
      alert('The topping name you provided was not valid.');
      return;
    }

    // If they haven't selected a category it'll be our default value
    if (category === 'Select a category') {
      alert('You must select a category for your topping.');
      return;
    }

    const resp = await axios.post('/toppings', {
      'request': 'set',
      'topping_name': toppingInput,
      'category': category
    })
      .catch((e) => {
        console.log("Caught an error at handleNewTopping with: " + e);
      });

    if (resp.data['topping'] === 'success') {
      nav('/toppings');
    } else {
      alert('You cannot make a duplicate topping. Please try again.');
    }
  }

  useEffect(() => {
  }, [category])

  return (
    <div>
      <h1>
        Add your new topping
      </h1>
      <p>
        Select a unique name for your topping, and select a category that best describes your topping.
      </p>

      {'Topping Name: '}
      <input
        id={'name'}
        placeholder={'Input the topping name.'}
      />

      <hr/>

      <p>
        Category: {category}
      </p>
      <Tab.Container>
        <div className={'row'}>
          <div className={'col'}>
            <ListGroup>
              <ListGroup.Item
                action
                onClick={() => handleCategory('Sauce')}
                variant={'danger'}
              >
                Sauce
              </ListGroup.Item>
              <ListGroup.Item
                action
                onClick={() => handleCategory('Cheese')}
                variant={'warning'}
              >
                Cheese
              </ListGroup.Item>
              <ListGroup.Item
                action
                onClick={() => handleCategory('Meat')}
                variant={'info'}
              >
                Meat
              </ListGroup.Item>
              <ListGroup.Item
                action
                onClick={() => handleCategory('Veggie')}
                variant={'success'}
              >
                Veggies
              </ListGroup.Item>
            </ListGroup>
          </div>
        </div>
      </Tab.Container>
      <br/>
      <button
        onClick={handleNewTopping}
      >
        Add Topping
      </button>

      <button
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  )
}

export default NewTopping