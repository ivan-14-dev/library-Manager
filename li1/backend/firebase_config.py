import firebase_admin
from firebase_admin import credentials, auth, firestore, storage

# Charger la clé privée
cred = credentials.Certificate("config/serviceAccountKey.json")

# Initialiser Firebase
firebase_admin.initialize_app(cred, {
    "storageBucket": "news-on-go.appspot.com" 
})

# Clients utiles
db = firestore.client()     # Firestore
bucket = storage.bucket()   # Storage
auth_client = auth          # Authentification