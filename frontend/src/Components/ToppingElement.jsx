import {useState} from "react";
import axios from "axios";

function ToppingElement({toppingName}) {
  const [edit, setEdit] = useState(false);

  async function handleEditTopping() {
    if (edit) {
      const userInput = document.getElementById('editInput').value;

      if (userInput === '' || userInput.length < 3 || userInput === toppingName)
      {
        alert('The topping name you provided was not valid.');
        return;
      }

      const resp = await axios.post('/toppings', {
        'request': 'update',
        'topping_name': toppingName,
        'new_topping_name': userInput
      })
      .catch((e) => {
        console.log("Caught an error at handleEditTopping with: " + e);
      });

      console.log("Result: " + resp.data['topping']);

      if (resp.data['topping'] === 'success') {
        window.location.reload();
      } else {
        alert('The topping name you provided was not valid.');
      }
      setEdit(false);
    } else {
      setEdit(true);
    }
  }

  async function handleDelete() {
    const resp = await axios.post('/toppings', {
      'request': 'delete',
      'topping_name': toppingName
      })
      .catch((e) => {
        console.log("Caught an error at handleDelete with " + e);
      });

    if (resp.data['topping'] === 'success') {
      window.location.reload();
      setEdit(false);
    }
  }

  function handleCancel() {
    setEdit(false);
  }

  return (
    <div className={'container row'}>
      {
        edit ?
          <>
            <div className={'col-lg-2 col-sm'}>
              <h5>
                {toppingName}
              </h5>
            </div>
            <div className={'col-lg-4 col-sm'}>
              <input
                id={'editInput'}
                placeholder={'Toppping Name'}
              />
            </div>
            <div className={'col-lg-2 col-sm'}>
              <button
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </>
          :
          <div className={'col-lg-8 col-sm'}>
            <h3>
              {toppingName}
            </h3>
          </div>
      }

      <div className={'col-lg-2 col-sm'}>
        <button
          onClick={handleEditTopping}
        >
          {
            edit ?
              'Confirm'
              :
              'Edit'
          }
        </button>
      </div>

      <div className={'col-lg-2 col-sm'}>
        <button
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      <hr/>

    </div>
  )
}

export default ToppingElement