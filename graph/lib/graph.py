import networkx as nx
import matplotlib.pyplot as plt


def create_graph(nodes, max_node_count):

	graph = nx.DiGraph()
	node_count = 0

	for node_pair in nodes:

		if node_count >= max_node_count:
			break

		graph.add_edge(node_pair[0], node_pair[1])
		node_count = node_count + 1

	return graph


def plot_graph(graph, options):

	plt.figure(figsize=(10,10), dpi=100)
	nx.draw_random(graph, **options)
	
	return plt


def plot_degree_distribution(graph):

	nodes, degrees = zip(*graph.degree())
	degrees = list(degrees)

	bins = []
	for i in range(1,11):
		bins.append(i)

	plt.figure(figsize=(7,7), dpi=100)
	plt.title("Degree Histogram")
	plt.xticks(bins)
	plt.hist(degrees, bins)

	return plt


def plot_betweenness(graph):

	betweenness = list(nx.betweenness_centrality(graph).values())

	plt.figure(figsize=(7,7), dpi=100)
	plt.title("Betweenness")
	plt.hist(betweenness)

	return plt


def plot_clustering_coefficient(graph):

	clustering_coefficient= list(nx.clustering(graph).values())

	plt.figure(figsize=(7,7), dpi=100)
	plt.title("Clustering Coefficient")
	plt.hist(clustering_coefficient)

	return plt


def average_clustering_coefficient(graph):

	return nx.average_clustering(graph)


def page_rank(graph):

	return nx.pagerank(graph)


def diameter(graph):

	return nx.diameter(graph)

