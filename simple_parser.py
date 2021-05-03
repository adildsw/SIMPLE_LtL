from lark import Lark, Transformer
from pyModelChecking.LTL import *

GRAMMAR = r"""
    ?value: "true"          -> true
        | "false"           -> false
        | ap
        | value "∧" value   -> and_formula
        | value "∨" value   -> or_formula
        | "¬" value         -> not_formula
        | "◯" value         -> next_formula
        | value "U" value   -> until_formula
        | value "→" value   -> implies_formula
        | "♢" value         -> eventually_formula
        | "□" value         -> always_formula
        | "(" value ")"     -> parent_formula

    ap: /[a-zA-Z_][a-zA-Z_0-9]*/
        | ESCAPED_STRING

    %import common.ESCAPED_STRING
    %import common.WS
    %ignore WS
"""


class Parser:
    def __init__(self):
        self.parser = Lark(GRAMMAR, start="value", parser="lalr", transformer=LTLTransformer())

    def __call__(self, formula):
        return self.parser.parse(formula)


class LTLTransformer(Transformer):
    
    def and_formula(self, subformulas):
        return And(*subformulas)
    
    def or_formula(self, subformulas):
        return Or(*subformulas)
    
    def not_formula(self, subformula):
        return Not(*subformula)

    def next_formula(self, subformula):
        return X(*subformula)

    def until_formula(self, subformulas):
        return U(*subformulas)

    def implies_formula(self, subformulas):
        return Imply(*subformulas)

    def eventually_formula(self, subformula):
        return F(*subformula)

    def always_formula(self, subformula):
        return G(*subformula)
    
    def parent_formula(self, subformula):
        return subformula[0]

    def true(self):
        return Bool(True)

    def false(self):
        return Bool(False)

    def ap(self, s):
        (s,) = s
        return AtomicProposition(s)

