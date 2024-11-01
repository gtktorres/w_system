from django.shortcuts import render
import joblib
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

name_model = joblib.load('../../Toxic-Comment-Model-master/Stuctured Data-Jigsaw Toxic Comment.ipynb')
avatar_model = joblib.load('../../Toxic-Comment-Model-master/Stuctured Data-Jigsaw Toxic Comment.ipynb')

@csrf_exempt
def toxic_pattern_name(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # Assuming your model accepts a feature array
        prediction = name_model.predict([data['features']])
    
    return JsonResponse({'prediction': prediction.tolist()})

@csrf_exempt
def toxic_pattern_avatar(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # Assuming your model accepts a feature array
        prediction = avatar_model.predict([data['features']])
    
    return JsonResponse({'prediction': prediction.tolist()})

