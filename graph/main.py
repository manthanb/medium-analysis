from lib import db
from lib import graph	

def main():

	client = db.get_client("localhost", 27017)
	db_conn = db.connect_to_db(client, "medium")
	collection = db.get_collection(db_conn, "userinfo")

	users = db.get(collection, {})

	db.close(client)

	g = graph.create_graph(get_nodes(users), 200)
	
	graph_plt = graph.plot_graph(g, {"with_labels": False, "node_color": "blue", "width": 1.0, "node_width": 0.5})
	graph_plt.show()

	degree_histogram_plt = graph.plot_degree_distribution(g)
	degree_histogram_plt.show()

	betweenness_plt = graph.plot_betweenness(g)
	betweenness_plt.show()

	clustering_coefficient_plot = graph.plot_clustering_coefficient(g)
	clustering_coefficient_plot.show()

	print(graph.page_rank(g))
	print(graph.average_clustering_coefficient(g))

def get_nodes(users):

 	nodes = []

 	for user in users:
 		for followee in user["following"]:
 			node = []
 			node.append(user["id"])
 			node.append(followee)
 			nodes.append(node)

 	return nodes

main()



