from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Ruta segura: guarda en la carpeta "Documentos" del usuario
ruta_documentos = os.path.join(os.path.expanduser("~"), "Documents")
ARCHIVO_DATOS = os.path.join(ruta_documentos, "compras.jsonl")

@app.route('/datos', methods=['POST'])
def recibir_datos():
    datos = request.get_json(force=True)
    print("Datos recibidos:", datos)

    try:
        with open(ARCHIVO_DATOS, 'a', encoding='utf-8') as archivo:
            archivo.write(json.dumps(datos, ensure_ascii=False) + '\n')
        return jsonify({"mensaje": "Datos guardados en Documentos correctamente"}), 200
    except Exception as e:
        return jsonify({"mensaje": f"Error al guardar los datos: {e}"}), 500

@app.route('/')
def home():
    return "Servidor Flask funcionando correctamente"

if __name__ == '__main__':
    print(f"Guardando datos en: {ARCHIVO_DATOS}")
    app.run(debug=True, port=5000)
