	
FROM python:3.11-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .
EXPOSE 5000
ENV FLASK_APP=wsgi.py

CMD ["gunicorn", "wsgi:app", "--bind", "0.0.0.0:5000"]
