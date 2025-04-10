from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.message import EmailMessage

app = Flask(__name__)
CORS(app)

# Configuración del correo
EMAIL_REMITENTE = 'comprasonlineindumentariaar@gmail.com'
CONTRASENA_APP = 'qjrg etph silv cmuo'
EMAIL_DESTINO = 'rotelaacaatriel@gmail.com'

# Función para enviar el email con los datos del comprador
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

    # Enviar el correo usando SMTP de Gmail
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(EMAIL_REMITENTE, CONTRASENA_APP)
        smtp.send_message(mensaje)

# Ruta de test
@app.route('/')
def home():
    return '🛒 Backend de Indumentaria AR funcionando correctamente.'

# Ruta para recibir datos del formulario de compra
@app.route('/datos', methods=['POST'])
def recibir_datos():
    datos = request.get_json(force=True)
    try:
        enviar_email(datos)
        return jsonify({"mensaje": "✅ ¡Compra enviada correctamente!"}), 200
    except Exception as e:
        print("❌ Error al enviar el correo:", e)
        return jsonify({"mensaje": f"❌ Error al enviar el correo: {e}"}), 500

# Iniciar el servidor
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
