import {useNavigate} from "react-router-dom";

function CredentialsForm({btnSubmit, title, description, clickFunc}) {

  const nav = useNavigate();

  function handleCancel() {
    nav('/');
  }

  return (
    <div className={'container'}>
      <h1>
        {title}
      </h1>
      <p>
        {description}
      </p>

      <hr/>

      <div className={'row'}>

        <div className={'col-12'}>
          <input
            id={'email'}
            type={'email'}
            style={{width: '100%'}}
          />
        </div>

        <div className={'col-12'}>
          <input
            id={'password'}
            type={'password'}
            style={{width: '100%'}}
          />
        </div>

        <button
          onClick={clickFunc}
        >
          {btnSubmit}
        </button>

        <button
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default CredentialsForm