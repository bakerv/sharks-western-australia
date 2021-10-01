# Sharks Sighting API

<center><img src="https://github.com/cphyland/Project-2/blob/main/static/images/shipwreck.jpg"></center>

## Are Ariel and Flounder in danger as they rummage through the shipwreck?


Using a python flask-powered API, pandas, sqlalchemy, HTML/CSS, JavaScript, SQLite, textillate.js, bootstrap, d3.js, and leaflet.js we created a map to visualize shark sightings and shipwreck locations. Our goal was to answer the question: [Do sharks frequent shipwreck locations?](https://sharks-western-australia.herokuapp.com)

[<img src ="https://github.com/cphyland/Project-2/blob/main/static/images/shark_tracker_sample.PNG">](https://sharks-western-australia.herokuapp.com)

## Data

We found databases covering Western Australia for both shark and shipwreck locations. The shark data comes from [Western Australia's Shark Hazard API](https://catalogue.data.wa.gov.au/dataset/western-australia-s-govhack-shark-hazard-api). This database is comprised of tagged shark detections, and public reports of shark sightings. Comprising over 17,000 reports, and updated daily, this database powers the Government of Western Australia's [SharkSmart Shark Activity](https://www.sharksmart.com.au/shark-activity/) tracker. 

 The shipwreck data comes from [Shipwrecks (WAM-002)](https://catalogue.data.wa.gov.au/dataset/shipwrecks). This database, provided by the Western Australia Museum, contains roughly 1650 shipwrecks in the same geographic area as our shark data.

## Analysis

Based on previous articles we had read, we decided to test the hypothesis that sharks display site fidelity at shipwreck locations. In particular, we were looking for a visual correlation when looking at sharks and shipwrecks on the same map.

This was not the case. While there are a few shark sightings near shipwrecks, the majority of the sharks are no where near the ships. This analysis does not support the hypothesis of site fidelity.

We believe this is due to limitations in our shark data. Reports in Western Australia's Shark Hazard API come primarily from individuals and devices monitoring the beaches.  This data is used to provide safety alerts for Western Australia's beaches. This introduces location bias into the data. Shark activity near the beaches is more commonly entered in the database.

In the future, this analysis would be better completed by monitoring individual sharks, and determining in what locations they spend the most time.

## Sources

### Articles

Dvorsky, George. “Atlantic Shipwreck Graveyard May Be Key Habitat For IMPERILED SHARKS.” Gizmodo, Gizmodo, 23 Apr. 2019, [gizmodo.com/atlantic-shipwreck-graveyard-may-be-key-habitat-for-imp-1834244023](gizmodo.com/atlantic-shipwreck-graveyard-may-be-key-habitat-for-imp-1834244023).

Paxton, Avery B., et al. “Citizen Science Reveals Female Sand Tiger Sharks (Carcharias Taurus) Exhibit Signs of Site Fidelity On Shipwrecks.” The Ecological Society of America, John Wiley & Sons, Ltd, 22 Apr. 2019, [esajournals.onlinelibrary.wiley.com/doi/10.1002/ecy.2687](esajournals.onlinelibrary.wiley.com/doi/10.1002/ecy.2687).


### Data Sets

Department of Primary Industries and Regional Development. Western Australia’s Shark Hazard API. Department of Primary Industries and Regional Development, 2021.

Green, Jeremy. Shipwrecks (WAM-002). Western Australian Museum, 2018.
