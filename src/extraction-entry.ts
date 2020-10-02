import inquirer, { Question } from 'inquirer';
import {
  extractDescriptionFieldsFromCrime,
  extractDescriptionFieldsFromIncident,
  extractor
} from './extract_data_from_description';

const questions: Question[] = [
  {
    type: 'string',
    message: 'please enter input file path: <some_name>.csv',
    name: 'inputFile'
  },
  {
    type: 'string',
    message: 'please enter out file: <some_name>.csv',
    name: 'outputFile'
  },
  {
    type: 'list',
    message: 'please pick either C for crime stats or I for incident stats',
    name: 'mapType',
    choices: ['Incident', 'Crime']
  }
];
inquirer
  .prompt(questions)
  .then(async answers => {
    await extractor(
      answers.inputFile,
      answers.outputFile,
      answers.mapType === 'Incident'
        ? extractDescriptionFieldsFromIncident
        : extractDescriptionFieldsFromCrime
    );
  })
  .catch(error => {
    console.log(error);
  });
