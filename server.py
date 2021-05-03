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

    try:
        K = parseKripkeString(data["kripke"])
    except:
        return Response(
            "ERROR: Invalid Kripke Structure. Please ensure there exists a Kripke structure with infinite paths.",
            status=400,
        )

    try:
        ltl_formula = parser(data["formula"])
    except:
        return Response(
            "ERROR: Invalid Formula. Please enter a valid formula.",
            status=400,
        )
    
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
    verification_results = []
    for formula in formulas:
        sat_set = modelcheck(K, A(formula))
        satisfy = init_states <= sat_set
        verification_results.append((str(formula), satisfy, sat_set))

    print(verification_results)

    for idx, item in enumerate(verification_results):
        item = list(item)
        item[2] = list(item[2])
        verification_results[idx] = list(item)

    return jsonify(verification_results)
    # return jsonify("Hello")

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
        L[stateName] = set([w.strip() for w in ap.split(",")])
    
    return Kripke(S, S0, R, L)
    

def main():
    ip = "127.0.0.1"
    port = 5000
    app.run(ip, port, debug=False)

if __name__ == "__main__":
    main()
