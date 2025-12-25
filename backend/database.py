import os
from pymongo import MongoClient

#client = MongoClient("mongodb://localhost:27017/") # Local
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://rawelb:LCXi5y5NLUy67yau@wealthai.9kakug7.mongodb.net/")
client = MongoClient(MONGO_URI)

db = client.ml_project
users = db.users
reports = db.reports