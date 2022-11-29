from django.contrib.auth import authenticate, login, logout
from django.forms import model_to_dict
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from rest_framework.decorators import api_view
from .models import PizzaOwner as User, PizzaOwner, Topping, Pizza


def home(request):
    theIndex = open('static/index.html').read()
    return HttpResponse(theIndex)


@api_view(['GET'])
def who_am_i(request):
    if request.user.is_authenticated:
        data = serializers.serialize("json", [request.user],
                                     fields=['email', 'username'])

        return HttpResponse(data)
    else:
        return JsonResponse({'user': None})


@api_view(['POST'])
def sign_up(request):
    try:
        User.objects.create_user(username=request.data['email'], password=request.data['password'],
                                 email=request.data['email'])

    except Exception as e:
        return JsonResponse({'signup': 'fail', 'fail-reason': str(e)})

    # Successfully created the account
    return JsonResponse({'signup': 'success'})


@api_view(['POST'])
def log_in(request):
    email = request.data['email']
    password = request.data['password']
    user = authenticate(username=email, password=password)

    if user is not None and user.is_active:
        try:
            login(request._request, user)
            return JsonResponse({'login': 'success'})

        except Exception as e:
            return JsonResponse({'login': 'fail', 'fail-reason': e})

    else:
        return JsonResponse({'login': 'fail'})


@api_view(['POST'])
def log_out(request):
    logout(request)
    return JsonResponse({'success': True})


@api_view(['POST'])
def toppings(request):
    # We should be able to add, update, and delete with this view

    # Are they even logged in?
    if not request.user.is_authenticated:
        return JsonResponse({'topping': 'fail'})

    # They are logged in, let's verify they actually exist before attempting to pull data
    pizza_owner = PizzaOwner.objects.filter(username=request.user).exists()

    if not pizza_owner:
        return JsonResponse({'topping': 'fail'})

    # Let's attempt to process the POST request
    if request.method == 'POST' and request.data['request'] == 'set':
        try:
            Topping.objects.create(pizza_owner=request.user,
                                   topping_name=request.data['topping_name'],
                                   category=request.data['category'])

        except Exception as e:
            return JsonResponse({'topping': 'fail', 'fail-reason': str(e)})

        return JsonResponse({'topping': 'success'})

    elif request.method == 'POST' and request.data['request'] == 'get':
        has_toppings = Topping.objects.filter(pizza_owner=request.user,
                                              category=request.data['category']).exists()

        if has_toppings:
            found_toppings = Topping.objects.filter(pizza_owner=request.user,
                                                    category=request.data['category']).values()

            results = [entry['topping_name'] for entry in found_toppings]

            return JsonResponse({'topping': results})

        return JsonResponse({'topping': 'None'})

    elif request.method == 'POST' and request.data['request'] == 'getall':
        has_toppings = Topping.objects.filter(pizza_owner=request.user).exists()

        if has_toppings:
            found_toppings = Topping.objects.filter(pizza_owner=request.user).values()

            results = [entry['topping_name'] for entry in found_toppings]

            return JsonResponse({'topping': results})

        return JsonResponse({'topping': 'None'})

    elif request.method == 'POST' and request.data['request'] == 'update':
        has_selected_topping = Topping.objects.filter(pizza_owner=request.user,
                                                      topping_name=request.data['topping_name']).exists()

        if has_selected_topping:
            try:
                selected_topping = Topping.objects.get(pizza_owner=request.user,
                                                       topping_name=request.data['topping_name'])

                selected_topping.topping_name = request.data['new_topping_name']
                selected_topping.save()

            except Exception as e:
                return JsonResponse({'topping': 'fail', 'fail-reason': str(e)})

            return JsonResponse({'topping': 'success'})

        return JsonResponse({'topping': 'fail'})

    if request.method == 'POST' and request.data['request'] == 'delete':
        has_selected_topping = Topping.objects.filter(pizza_owner=request.user,
                                                      topping_name=request.data['topping_name']).exists()

        if has_selected_topping:
            Topping.objects.get(pizza_owner=request.user,
                                topping_name=request.data['topping_name']).delete()

            return JsonResponse({'topping': 'success'})

        return JsonResponse({'topping': 'fail'})


@api_view(['GET', 'POST'])
def pizzas(request):
    # Are they even logged in?
    if not request.user.is_authenticated:
        return JsonResponse({'pizza': 'fail'})

    # They are logged in, let's verify they actually exist before attempting to pull data
    pizza_owner = PizzaOwner.objects.filter(username=request.user).exists()

    if not pizza_owner:
        return JsonResponse({'pizza': 'fail'})

    if request.method == 'POST' and request.data['request'] == 'set':
        try:
            Pizza.objects.create(pizza_owner=request.user,
                                 pizza_name=request.data['pizza_name'],
                                 topping_list=request.data['ingredients'])

        except Exception as e:
            return JsonResponse({'pizza': 'fail', 'fail-reason': str(e)})

        return JsonResponse({'pizza': 'success'})

    if request.method == 'POST' and request.data['request'] == 'get':
        selected_pizza = Pizza.objects.filter(pizza_owner=request.user, pizza_name=request.data['pizza_name']).exists()

        if selected_pizza:
            found_pizzas = Pizza.objects.filter(pizza_owner=request.user,
                                                pizza_name=request.data['pizza_name']).values()

            ingredients = ''
            for pizza in found_pizzas:
                if pizza['pizza_name'] == request.data['pizza_name']:
                    ingredients = pizza['topping_list']

            return JsonResponse({'pizza': 'success', 'found_ingredients': ingredients})

    if request.method == 'POST' and request.data['request'] == 'delete':
        selected_pizza = Pizza.objects.filter(pizza_owner=request.user,
                                              pizza_name=request.data['pizza_name']).exists()

        if selected_pizza:
            Pizza.objects.get(pizza_owner=request.user,
                              pizza_name=request.data['pizza_name']).delete()

            return JsonResponse({'pizza': 'success'})

        return JsonResponse({'pizza': 'fail'})

    if request.method == 'POST' and request.data['request'] == 'update':
        has_selected_pizza = Pizza.objects.filter(pizza_owner=request.user,
                                                  pizza_name=request.data['pizza_name']).exists()

        if has_selected_pizza:
            try:
                selected_pizza = Pizza.objects.get(pizza_owner=request.user,
                                                   pizza_name=request.data['pizza_name'])

                selected_pizza.pizza_name = request.data['new_pizza_name']
                selected_pizza.topping_list = request.data['ingredients']
                selected_pizza.save()

            except Exception as e:
                return JsonResponse({'pizza': 'fail', 'fail-reason': str(e)})

            return JsonResponse({'pizza': 'success'})

        return JsonResponse({'pizza': 'fail'})

    if request.method == 'GET':
        has_pizzas = Pizza.objects.filter(pizza_owner=request.user).exists()

        if has_pizzas:
            all_pizzas = Pizza.objects.filter(pizza_owner=request.user).values()

            pizza_names = [entry['pizza_name'] for entry in all_pizzas]

            return JsonResponse({'pizza': 'success', 'pizza_list': pizza_names})

        return JsonResponse({'pizza': 'fail'})
