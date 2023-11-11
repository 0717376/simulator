from flask import Flask, render_template, jsonify, request
import json

app = Flask(__name__)


# Загрузка данных вопросов
with open('data/questions.json', 'r') as file:
    questions = json.load(file)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/get_question/<int:id>')
def get_question(id):
    with open('data/questions.json') as file:
        questions = json.load(file)
    question = questions.get(str(id))
    if question is None:
        return jsonify({"end": True})
    return jsonify(question)


if __name__ == '__main__':
    app.run(debug=True)
