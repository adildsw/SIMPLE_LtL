from flask import Flask, render_template

app = Flask(__name__, static_folder="web/", template_folder="web/")

@app.route("/")
def home():
    return render_template("index.html")

def main():
    ip = "127.0.0.1"
    port = 5000

    app.run(ip, port, debug=True)

if __name__ == "__main__":
    main()