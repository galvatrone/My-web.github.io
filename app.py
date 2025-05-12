from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/code', methods=['GET', 'POST'])
def code():
    result = None
    if request.method == 'POST':
        try:
            code = request.form['code']
            result = str(eval(code))  # ⚠️ Не безопасно! Только для тестов
        except Exception as e:
            result = f"Ошибка: {e}"
    return render_template('code.html', result=result)
