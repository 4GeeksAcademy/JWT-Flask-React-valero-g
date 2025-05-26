"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import bcrypt
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from sqlalchemy import select
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)


# Allow CORS requests to this API
CORS(api)



@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# Signup Endpoint
@api.route('/signup', methods = ['POST'])
def signup():
    try:
        body = request.get_json(silent = True)
        # Validación del body 
        if "email" not in body or "password" not in body:
            return {"message": "Wrong request"}, 400
        # Validación de que el email no esté ya registrado
        user = db.session.execute(select(User).where(User.email == body["email"])).scalar_one_or_none()
        print(user)
        if user != None:
            return {"message": "User already exists"}, 400
        #Password management
        # converting password to array of bytes
        bytes = body["password"].encode('utf-8')
        # generating the salt
        salt = bcrypt.gensalt()
        # Hashing the password
        hash = bcrypt.hashpw(bytes, salt)

        # Agregamos user y password
        new_user = User(email = body["email"], password =  hash.decode('utf-8'), is_active = True)
        print(new_user)
        db.session.add(new_user)
        db.session.commit()
        return {"message": "User created successfully"}, 200
    except Exception as e:
        print("Error :",e)
        return {"message": "Sign up could not be completed"}, 404

# Token Endpoint
@api.route("/token", methods = ['POST'])
def get_token():
    try:
        email = request.json.get("email", None)
        password = request.json.get("password", None)

        # Comprobamos que el usuario exista
        user = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()
        if user == None:
            return {"message":"User cannot be found"}, 401

        # Chequeo de contraseña
        # encoding user password
        userBytes = password.encode('utf-8')
        user_pass = user.password.encode('utf-8')
        # checking password
        result = bcrypt.checkpw(userBytes,user_pass)
        if (result):
            access_token = create_access_token(identity=str(user.id))
            return jsonify({ "token": access_token, "user_id": user.id }) 
        else:
            return {"message":"Wrong email or password"}, 400
    except:
        return {"message":"Unable to complete operation"}, 404


# Private
@api.route("/private", methods=["GET"])
@jwt_required()
def get_hiddden_message():
    try:
        print("a")
        # Accede a la identidad del usuario actual con get_jwt_identity
        current_id = get_jwt_identity()
        user = db.session.execute(select(User).where(User.id == current_id)).first()
        # Validacion de user
        if (user != None):
            response_body = {"message": "Este es el super mensaje secreto que viene de la API tras autentificarse con TOKEN"}
            return jsonify(response_body), 200
        else:
            return {"message":"No access to secret message"}, 400
    
    except Exception as e:
        print("Error in /private route:", e)
        return {"message":"Unable to complete operation"}, 404



@api.errorhandler(422)
def handle_422(err):
    return jsonify({"error": "Unprocessable Entity", "details": str(err)}), 422