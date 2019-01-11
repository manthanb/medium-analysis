from pymongo import MongoClient

# creat a client to database server for given host and port
def get_client(host, port):
	return MongoClient(host, port)

# create a connection to given database for given client(session)
def connect_to_db(client, dbname):
	return client[dbname]

# connect to given collection in given database
def get_collection(db, collection):
	return db[collection]

# get(select) documents from given collection(table) based on given query(where clause)
def get(collection, query):
	return collection.find(query)

# close db session
def close(client):
	return client.close()