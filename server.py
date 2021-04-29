import json

from flask import Flask, Response, request, render_template
from pyModelChecking import Kripke
from pyModelChecking.LTL import *

from parser import Parser

app = Flask(__name__, static_folder="web/", template_folder="web/")
parser = Parser()

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

    kripke_args = data["kripke"]
    K = Kripke(**kripke_args)
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

    return {"results": verfication_results}

def main():
    ip = "127.0.0.1"
    port = 5000
    app.run(ip, port, debug=True)

if __name__ == "__main__":
    main()