import pandas as pd
import requests
from sqlalchemy import create_engine


# paths to access and save data
shark_url = "http://api.fish.wa.gov.au/webapi/v1/RawData"
ship_path = "data/shipwrecks/ShipwrecksWAM_002.geojson"

# Specify start and end dates for the return data, must be in the format: "YYYY-MM-DD"
start_date = "2020-01-01"
end_date = "2021-07-01"

def shark_data(api_url, start_date, end_date):
    """
        Access the API at the specified URL, clean the data, filter the data, and return the JSON object as a pandas DataFrame

            Args:
                api_url (str): the URL to download the desired data from the API
                start_date (str): return data beginning at this date YYYY-MM-DD
                end_date (str): return data ending at this date YYYY-MM-DD
    """

    # get a JSON object from the specified url, and convert it to a pandas dataframe
    def get_sharks(api_url):
    
        response = requests.get(api_url).json()
        sharks_df = pd.DataFrame(response)

        return sharks_df

    # clean the rawdata returned from the API to correct duplicate entries, and remove reports that are not sharks
    def clean_sharks(sharks_df):
        clean_sharks = sharks_df.copy()

        # correct duplicate species entries present in the data
        clean_sharks['SightingSpeciesValue'] = clean_sharks['SightingSpeciesValue'].replace({
        'Whale Carcass':'whale carcass',
        'whale carcass ':'whale carcass',
        'whaler':'bronze whaler',
        'shortfin mako':'mako', 
        'white ': 'white'})

        # correct duplicate report owner entries present in the data
        clean_sharks['OwnerValue'] = clean_sharks['OwnerValue'].replace({
        'Fisheries advise': 'Fisheries Advise',
        'SLS Lifesavers report ': 'SLS Lifesavers report',
        'SLS Westpac Heli': 'SLS Westpac Heli report',
        'Public Report': 'Public report'})

        # drop entries that do not correspond to a confirmed shark sighting
        drop_species = ['whale carcass',   # create a list of species values to filter out
                        'detection event - possible',
                        'other',
                        'sonar object'] 
        species_filter = ~clean_sharks.SightingSpeciesValue.isin(drop_species) # use the list to create a filter
        clean_sharks = clean_sharks[species_filter] # apply the filter to the dataframe

        # limit the data to what is required by the leaflet plot
        clean_sharks = clean_sharks[['InteractionValue','InteractionId','SightingSpeciesValue',
                                    'SightingDateTime','OwnerValue','LocationX','LocationY']]

        return clean_sharks

    # limit the data to entries in a specified interval
    def date_filter(data,start_date,end_date):
        filtered_df = data.copy()
        filtered_df = filtered_df.loc[
        (filtered_df["SightingDateTime"] > start_date) & (filtered_df["SightingDateTime"] < end_date)]

        return filtered_df

    rawdata = get_sharks(api_url)
    clean_data = clean_sharks(rawdata)
    filtered_df = date_filter(clean_data,start_date,end_date)

    return filtered_df

def load_database(data_df, table_name, connection_string):
    """ Create a table in a sqlite database from a pandas dataframe.
     If the sqlite database does not exist, this will create one at the specified location.
           
            Args:
                data_df (pandas.DataFrame): The pandas dataframe to be stored in the sqlite database
                table_name (str): The name to use for the table
                connection_string (str): The location of the sqlite database.
                The database filename must end in .sqlite
    """
    # create a connectiong to the database with sqlalchemy
    engine = create_engine(f'sqlite:///{connection_string}')

    # load a table into the database with pandas
    data_df.to_sql(table_name, con=engine, if_exists='replace')












