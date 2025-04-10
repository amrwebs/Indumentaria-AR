from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.message import EmailMessage

app = Flask(__name__)
CORS(app)  # Habilita CORS para conexiones externas si accedés desde celular u otro dispositivo

# Configuración del correo
EMAIL_REMITENTE = 'comprasonlineindumentariaar@gmail.com'
CONTRASENA_APP = 'qjrg etph silv cmuo'  # Contraseña de aplicación generada en tu cuenta Gmail
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

    # Enviar el correo
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(EMAIL_REMITENTE, CONTRASENA_APP)
        smtp.send_message(mensaje)

@app.route('/datos', methods=['POST'])
def recibir_datos():
    datos = request.get_json(force=True)
    print("✅ Datos recibidos:", datos)

    try:
        enviar_email(datos)
        return jsonify({"mensaje": "✅ ¡Compra enviada por correo correctamente!"}), 200
    except Exception as e:
        print("❌ Error al enviar correo:", e)
        return jsonify({"mensaje": f"❌ Error al enviar el correo: {e}"}), 500

@app.route('/')
def home():
    return "Servidor Flask funcionando correctamente."

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
