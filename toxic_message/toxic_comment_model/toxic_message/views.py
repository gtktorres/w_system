from django.shortcuts import render
import joblib
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

model = joblib.load('../Toxic-Comment-Model-master/Stuctured Data-Jigsaw Toxic Comment.ipynb')

@csrf_exempt
def predict(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # Assuming your model accepts a feature array
        prediction = model.predict([data['features']])
        return JsonResponse({'prediction': prediction.tolist()})


