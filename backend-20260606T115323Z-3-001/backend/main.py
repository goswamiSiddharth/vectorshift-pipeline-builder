# main.py — Part 4: Backend Integration

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any, Dict

app = FastAPI()

# Allow React dev server (port 3000) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request Models ───────────────────────────────────────────

class Node(BaseModel):
    id: str
    type: str | None = None
    data: Dict[str, Any] = {}

class Edge(BaseModel):
    id: str
    source: str
    target: str

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


# ─── DAG Check (Kahn's Algorithm / topological sort) ─────────

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """Returns True if the graph is a Directed Acyclic Graph."""
    node_ids = {n.id for n in nodes}

    # Build adjacency list and in-degree map
    adj: Dict[str, List[str]] = {nid: [] for nid in node_ids}
    in_degree: Dict[str, int] = {nid: 0 for nid in node_ids}

    for edge in edges:
        src, tgt = edge.source, edge.target
        # Guard against edges referencing missing nodes
        if src not in adj or tgt not in adj:
            continue
        adj[src].append(tgt)
        in_degree[tgt] += 1

    # Kahn's BFS
    from collections import deque
    queue = deque([nid for nid, deg in in_degree.items() if deg == 0])
    visited = 0

    while queue:
        node = queue.popleft()
        visited += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_ids)


# ─── Routes ──────────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": dag,
    }
