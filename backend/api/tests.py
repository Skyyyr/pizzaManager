from django.test import TestCase
from django.urls import reverse, resolve
from .views import home, log_in, sign_up, log_out, who_am_i, toppings, pizzas
from .models import PizzaOwner, Pizza, Topping


class TestViews(TestCase):

    def test_home_url_is_resolved(self):
        url = reverse('home')
        self.assertEquals(resolve(url).func, home)

    def test_login_url_is_resolved(self):
        url = reverse('login')
        self.assertEquals(resolve(url).func, log_in)

    def test_url_signup_is_resolved(self):
        url = reverse('signup')
        self.assertEquals(resolve(url).func, sign_up)

    def test_url_logout_is_resolved(self):
        url = reverse('logout')
        self.assertEquals(resolve(url).func, log_out)

    def test_url_whoAmI_is_resolved(self):
        url = reverse('whoami')
        self.assertEquals(resolve(url).func, who_am_i)

    def test_url_toppings_is_resolved(self):
        url = reverse('toppings')
        self.assertEquals(resolve(url).func, toppings)

    def test_url_pizzas_is_resolved(self):
        url = reverse('pizzas')
        self.assertEquals(resolve(url).func, pizzas)


class TestModels(TestCase):
    def setUp(self):
        owner = PizzaOwner.objects.create(email='some@email.com')
        Topping.objects.create(pizza_owner=owner,
                               topping_name='Ranch',
                               category='Sauce')

        Topping.objects.create(pizza_owner=owner,
                               topping_name='Parmesan',
                               category='Cheese')

        Pizza.objects.create(pizza_owner=owner,
                             pizza_name='Cheesy Ranch',
                             topping_list='Ranch,Parmesan')

    def test_did_create_pizza_owner(self):
        owner = PizzaOwner.objects.get(email='some@email.com')

        self.assertEquals(owner.return_email(), 'some@email.com')

    def test_did_create_topping_1(self):
        topping = Topping.objects.get(pizza_owner=1,
                                      topping_name='Ranch')

        self.assertEquals(topping.return_owner_and_topping(), 'some@email.com, Ranch, Sauce')

    def test_did_create_topping_2(self):
        topping = Topping.objects.get(pizza_owner=1,
                                      topping_name='Parmesan')

        self.assertEquals(topping.return_owner_and_topping(), 'some@email.com, Parmesan, Cheese')

    def test_did_create_pizza(self):
        pizza = Pizza.objects.get(pizza_owner=1,
                                  pizza_name='Cheesy Ranch')

        self.assertEquals(pizza.return_owner_and_pizza(), 'some@email.com, Cheesy Ranch, Ranch,Parmesan')
