from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


#model

@app.route('/api/predictions', methods=['GET'])
def predictions():
    return jsonify({
        'message': 'hiiii'
    })

# @app.route('/api/predictions/2', methods=['GET'])
# def predictions2():
#     return jsonify({
#         'message': 'hiiii from 2'
#     })


if __name__ == "__main__":
    app.run(debug=True, port=8080)