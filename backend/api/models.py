from django.contrib.auth.models import AbstractUser
from django.db import models


class PizzaOwner(AbstractUser):
    # Make the e-mail the unique
    email = models.EmailField(
        verbose_name='Email',
        max_length=250,
        unique=True,
    )

    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'

    # We don't want to include any additional params to the requirements just email, and password
    REQUIRED_FIELDS = []

    def return_email(self):
        return f"{self.email}"

    def __str__(self):
        return f"{self.email}"


class Topping(models.Model):
    # Toppings are unique to each owner
    pizza_owner = models.ForeignKey(PizzaOwner, on_delete=models.CASCADE)

    # Topping name
    topping_name = models.CharField(max_length=50)

    # Category (This helps for organization)
    category = models.CharField(max_length=50)

    REQUIRED_FIELDS = [pizza_owner, topping_name, category]

    class Meta:
        unique_together = ['pizza_owner', 'topping_name']

    def return_owner_and_topping(self):
        return f"{self.pizza_owner}, {self.topping_name}, {self.category}"

    def __str__(self):
        return f"{self.topping_name}"


class Pizza(models.Model):
    # Pizzas are unique to each owner
    pizza_owner = models.ForeignKey(PizzaOwner, on_delete=models.CASCADE)

    pizza_name = models.CharField(max_length=50)

    # A list of ingredients, split by category
    topping_list = models.CharField(max_length=255)

    REQUIRED_FIELDS = [pizza_owner, pizza_name, topping_list]

    class Meta:
        # unique_together = ['pizza_owner', 'pizza_name', 'topping_list']
        unique_together = (('pizza_owner', 'pizza_name'), ('pizza_name', 'topping_list'))

    def return_owner_and_pizza(self):
        return f"{self.pizza_owner}, {self.pizza_name}, {self.topping_list}"

    def __str__(self):
        return f"{self.pizza_name}"
