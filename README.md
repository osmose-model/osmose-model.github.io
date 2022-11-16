This web ui is no longer supported, but its code and data remains available through this read-only archive.

# osmose-web-ui

This is a web user interface (web UI) that allows a user to define functional groups and a number of time steps per year for an OSMOSE model for a given marine region. This web UI utilizes JavaScript and the JQuery library. After the user has defined the study region, the web UI queries information stored in JavaScript Object Notation (JSON) data archives to define functional groups for the OSMOSE model. Then, the web UI offers the possibility to the user to redefine functional groups and the user is also requested to indicate the number of time steps per year of their OSMOSE model.

[![DOI](https://zenodo.org/badge/57102270.svg)](https://zenodo.org/badge/latestdoi/57102270)

Next, the information resulting from the interactions between the user and the web UI is passed to a web application (web API; https://github.com/osmose-model/osmose-web-api). The web API queries FishBase and SeaLifeBase data from TSV (tab-separated value) data archives and processes these data to generate OSMOSE input parameters, which are communicated to the web UI.

Finally, the web UI delivers a zip file (“osmose_config.zip”) to the user, which contains OSMOSE configuration files filled with information, as well as a “README” file and a CSV file listing the species making up the focal functional groups and biotic resources defined for the OSMOSE model.

# To use the web UI:

(1) Go to the FishBase(www.fishbase.org) or SeaLifeBase(www.sealifebase.org) website.

(2) Select “OSMOSE parameters” in the “Tools” section.

(3) Follow the detailed instructions provided by the web UI to ultimately retrieve the “osmose_config.zip” file.

