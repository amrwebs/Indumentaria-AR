from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import smtplib
from email.message import EmailMessage

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

EMAIL_REMITENTE = 'comprasonlineindumentariaar@gmail.com'
CONTRASENA_APP = 'qjrg etph silv cmuo'
EMAIL_DESTINO = 'rotelaacaatriel@gmail.com'

def enviar_email(datos):
    mensaje = EmailMessage()
    mensaje['Subject'] = f"🛒 Nueva compra: {datos['producto']}"
    mensaje['From'] = EMAIL_REMITENTE
    mensaje['To'] = EMAIL_DESTINO

    contenido = f"""
📦 NUEVA COMPRA 📦

Producto: {datos['producto']}
Precio: ${datos['precio']:,}

Nombre: {datos['nombre']}
Domicilio: {datos['domicilio']}
Localidad: {datos['localidad']}
Código Postal: {datos['codigoPostal']}
Teléfono: {datos['telefono']}
Correo del comprador: {datos['correo']}
"""
    mensaje.set_content(contenido)
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(EMAIL_REMITENTE, CONTRASENA_APP)
        smtp.send_message(mensaje)

@app.route('/')
def home():
    return render_template('producto.html')

@app.route('/datos', methods=['POST'])
def recibir_datos():
    datos = request.get_json(force=True)
    try:
        enviar_email(datos)
        return jsonify({"mensaje": "✅ ¡Compra enviada correctamente!"}), 200
    except Exception as e:
        return jsonify({"mensaje": f"❌ Error al enviar el correo: {e}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)