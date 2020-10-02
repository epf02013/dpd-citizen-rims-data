import { Parser } from 'json2csv';
import neatCsv from 'neat-csv';
import fs from 'fs';
import { Incident } from './get-incident-stats';

const getValue = (matcher: string, source: string) => {
  const regexy = new RegExp(`(?<=\\<b\\>${matcher}:\\<\\/b\\>)(.*?)(?=\\<|$)`);
  const match = source.match(regexy);
  return match[0].trim();
};

type ExpandedCrime = Incident & {
  Crime: string;
  CrimeClassification: string;
  CaseNumber: string;
  IncidentNumber: string;
};

export const extractDescriptionFieldsFromCrime = (
  item: Incident
): ExpandedCrime => ({
  ...item,
  Crime: getValue('Crime', item.Description),
  CaseNumber: getValue('Case #', item.Description),
  CrimeClassification: getValue('Crime Classification', item.Description),
  IncidentNumber: getValue('Incident #', item.Description)
});

const getTitleFromIncident = (source: string) => {
  const regexy = new RegExp('(?<=\\<big\\>)(.*?)(?=\\<\\/big\\>)');
  const match = source.match(regexy);
  return match[0].trim();
};
type ExpandedIncident = Incident & {
  Disposition:
    | 'Referred'
    | 'Service'
    | 'Unable to Locate'
    | 'Unfounded'
    | 'Cancelled by RP'
    | 'Report Taken'
    | 'Advised'
    | 'False Alarm'
    | 'Online Crime Report'
    | 'Incident Number Given'
    | 'MORF'
    | 'Cited'
    | 'Arrest Made'
    | 'Civil Problem'
    | 'TRANSIENT CONTACT'
    | 'Transient Contact';
  Title: string;
  IncidentNumber: string;
  CallType: string;
};
export const extractDescriptionFieldsFromIncident = (
  item: Incident
): ExpandedIncident => ({
  ...item,
  Disposition: getValue('Disposition', item.Description),
  Title: getTitleFromIncident(item.Description),
  IncidentNumber: getValue('Incident #', item.Description),
  CallType: getValue('Call Type', item.Description)
});

export const extractor = async (
  filename: string,
  outFile: string,
  extractionFunction: (item: Incident) => ExpandedCrime | ExpandedIncident
) => {
  const fileBuffer: Buffer = fs.readFileSync(filename);
  const incidents: Incident[] = await neatCsv(fileBuffer);
  const result = incidents.map(extractionFunction);
  const parser = new Parser({});
  const csv = parser.parse(result);
  fs.writeFileSync(outFile, csv);
};
