# Pizza Manager
This web application comes with a simple signup/login/logout system, along with the ability to create toppings and pizzas.
The authentication system doesn't require a real e-mail but one will be provided if you don't want to create an account.

Each owner (account) will be able to create their own menu to include their own unique toppings, and pizzas.

Provided email and password:

React (JS) and Django (Python) frameworks were used to create this website.

Below you'll find instructions on how to install, and run this web app locally.

## Instructions for building, and running tests locally
These instructions assume you're running on a Windows machine.
Links will be provided which will include other OS installation instructions.

[virtualenv installation link](https://python.land/virtual-environments/virtualenv)
1. git clone https://github.com/Skyyyr/pizzaManager.git
2. Create your python virtual environment
   1. (Suggested directory install) ../pizzaManager/backend/venv
      1. Run this command and exchange the directory for the actual directory `python -m venv <directory>`
3. Activate your venv (Virtual Environment)
   1. `venv\Scripts\activate.bat`
4. Install requirements.txt (located: ../pizzaManager)
   1. `pip install -r requirements.txt`
5. Ensure npm is installed
   1. [npm install](https://docs.npmjs.com/cli/v6/configuring-npm/install)
6. Install package.json (located: ../pizzaManager/frontend)
   1. `npm install`

#### Running the webapp locally
[Running Django](https://docs.djangoproject.com/en/4.1/intro/tutorial01/)
The link provided covers each OS type on how to use the run command

1. `py manage.py runserver`
2. Build the models for your local db (sqlite)
[sqlite with django](https://docs.djangoproject.com/en/4.1/topics/migrations/#sqlite)
   1. `./manage.py makemigrations`
   2. `./manage.py migrate`
3. Build your static files
   1. `npm run build`
4. open your preferred web browser and go to this location:
   1. `http://127.0.0.1:8000/`

#### Running tests locally
[Django Testing](https://docs.djangoproject.com/en/4.1/topics/testing/overview/)
The link provided 
1. `./manage.py test`
   1. All tests should pass
