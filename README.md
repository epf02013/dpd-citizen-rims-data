# Process
The data is pulled from the endpoints that provide the data for https://dpd.crimegraphics.com/2013/default.aspx. 
It basically copies the shape of the calls that the browser makes.
 
# Running it yourself
1. `npm i` 
2. `npm run pull-data`
    * this will prompt you for dates to get data for and an output file 
3. `npm run extract-description-data`
    * this will prompt you for the input file name and the type of the file

# Already pulled data
`/data/crime.csv` contains crime data from 1/25/2016 to 9/8/2020 with the description data extracted into fields 

`/data/incidents.csv` contains incident data from 2/12/2017 to 9/12/2020 with the description data extracted into fields

Those were around the earliest dates that returned data.
