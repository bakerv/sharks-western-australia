from flask import Flask, render_template, redirect
import flask_functions
from sqlalchemy import create_engine
import pandas as pd

shark_api_url = "http://api.fish.wa.gov.au/webapi/v1/RawData"
shark_table_name = "sharks1"
shark_csv_path = "../data/sharks/sharks_cleaned.csv"

# Flask Setup
app = Flask(__name__)

# Flask Routes

@app.route("/")
def indextest():
  return "pizza"

@app.route("/tracker")
def index():
  return render_template("SharkTracker.html")
  
@app.route("/update")
def update_data():
    sharks_df = flask_functions.shark_data(shark_api_url, "2020-01-01", "2021-07-01")
    flask_functions.load_database(sharks_df, shark_table_name, "data/sharks/australia.sqlite")

    sharks_df.to_csv("data/sharks/sharks_cleaned.csv")

    return redirect("/")

if __name__ == "__main__":
  app.run(debug=True)