import format from 'date-format';
import axios from 'axios';
import fs from 'fs';
import { Parser } from 'json2csv';
import { getDates } from './get-dates';

type Group = string;
type Status = string;

export type Incident = {
  Description: string;
  Latitude: number;
  Longitude: number;
  Title: string;
  Group: Group;
  TabTitle: string;
  Location: string;
  Icon: string;
  Shadow: string;
  DateOpened: string; // 'MM/DD/YYYY HH:mm:ss a'
  TimeOpened: string; // 'HH:MM:ss'
  DateClosed: string; // 'MM/DD/YYYY HH:mm:ss a'
  TimeClosed: string; // 'HH:MM:ss'
  Status: Status;
};
type APIResponse = {
  data: { d: Incident[] };
};

const getCrimeStats = async (
  startDate: Date,
  endDate: Date,
  mapType: string
): Promise<APIResponse> => {
  const groupTypes =
    mapType === 'I'
      ? '10851,ALC,ANIMAL,ARSON,ASSAULT,BURGLARY,CITY,DISTURB,FIREMED,FRAUD,HOMICIDE,MP,NARC,NOISE,OTHER,ROBBERY,SEXCRIME,THEFT,TRAFFIC,TRESPASS,VANDAL'
      : 'ARSON,ASSAULT,BURGLARY,HOMICIDE,LARCENY,RAPE,ROBBERY,STOLVEH';
  const res: APIResponse = await axios.post(
    'https://dpd.crimegraphics.com/2013/MapData.asmx/GetMapPoints',
    {
      AGCODE: 'DPD',
      CirLat: 0,
      CirLon: 0,
      CirRad: 0,
      GroupTypes: groupTypes,
      MapType: mapType,
      StartDate: format('MM/dd/yyyy', startDate),
      EndDate: format('MM/dd/yyyy', endDate)
    }
  );
  return res;
};

const wait = async (seconds: number) => {
  let resolve;
  const prom = new Promise(resolve1 => {
    resolve = resolve1;
  });
  setTimeout(resolve, seconds * 1000);
  await prom;
};

async function getAPIResponses(
  dates: Date[],
  endDateOffSet: number,
  mapType: 'I' | 'C'
) {
  const responses = [];
  for (let i = 0; i < dates.length; i += 1) {
    const start = dates[i];
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDay());
    end.setDate(start.getDate() + endDateOffSet);
    // eslint-disable-next-line no-await-in-loop
    await wait(1.5);
    // eslint-disable-next-line no-await-in-loop
    const response = await getCrimeStats(start, end, mapType);
    responses.push(response);
    console.log(i);
  }
  return Promise.all(responses);
}

const runTheJewels = async (
  startDate: string = '2020-03-03',
  endDate: string = '2020-03-07',
  outFile: string = 'csv.csv',
  endDateOffSet: number,
  mapType: 'I' | 'C'
) => {
  const dates = getDates(
    `${startDate}:00:00`,
    `${endDate}:00:00`,
    endDateOffSet
  );
  const pop = await getAPIResponses(dates, endDateOffSet, mapType);
  const result: Incident[] = pop
    .map((a: APIResponse) => {
      try {
        return a.data.d;
      } catch (e) {
        console.log(a);
        return [];
      }
    })
    .flat();
  console.log(result.length);
  try {
    const parser = new Parser({});
    const csv = parser.parse(result);
    fs.writeFileSync(outFile, csv);
  } catch (err) {
    console.error(err);
  }
};
export default runTheJewels;
