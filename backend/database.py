from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client.ml_project
users = db.users
