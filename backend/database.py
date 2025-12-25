import os
from pymongo import MongoClient

#client = MongoClient("mongodb://localhost:27017/") # Local
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)

db = client.ml_project
users = db.users
reports = db.reports