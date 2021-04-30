import json

from flask import Flask, Response, request, render_template, jsonify
from pyModelChecking import Kripke
from pyModelChecking.LTL import *

from simple_parser import Parser

app = Flask(__name__, static_folder="web/", template_folder="web/")
parser = Parser()

K = None

@app.route("/")
@app.route("/index")
def home():
    return render_template("index.html")

@app.route("/verify", methods=["POST"])
def verify():
    data = request.form

    if "kripke" not in data:
        return Response(
            "Bad request. Missing `kripke` input.",
            status=400,
        )
    if "formula" not in data:
        return Response(
            "Bad request. Missing `ltl_formula` input.",
            status=400,
        ) 

    K = parseKripkeString(data["kripke"])
    ltl_formula = parser(data["formula"])

    # Post-order traversal
    formulas = []
    def postorder(current):
        if hasattr(current, "_subformula"):
            subformulas = current._subformula
            for f in subformulas:
                postorder(f)
        
        formulas.append(current)

    postorder(ltl_formula)

    init_states = K.S0
    verfication_results = []
    for formula in formulas:
        sat_set = modelcheck(K, A(formula))
        satisfy = init_states <= sat_set
        verfication_results.append((str(formula), satisfy, sat_set))

    print(K)
    print(str({"results": verfication_results}))
    return str({"results": verfication_results})

def parseKripkeString(kripkeString):
    kripkeString = json.loads(kripkeString)

    S = kripkeString['S']
    S0 = kripkeString['S0']

    R = []
    for edge in kripkeString['R']:
        edge = tuple(edge.split("_"))
        R.append(edge)

    L = {}
    for item in kripkeString['L']:
        stateName = item.split("|")[0]
        ap = item.split("|")[1]
        if (ap == "Null"):
            continue
        L[stateName] = set(ap.split(","))
    
    return Kripke(S, S0, R, L)
    

def main():
    ip = "127.0.0.1"
    port = 5000
    app.run(ip, port, debug=True)

if __name__ == "__main__":
    main()