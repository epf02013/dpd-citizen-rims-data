import inquirer, { Question } from 'inquirer';
import runTheJewels from './get-incident-stats';

const questions: Question[] = [
  {
    type: 'string',
    message: 'please enter start date: yyyy-mm-dd',
    name: 'start'
  },
  { type: 'string', message: 'please enter end date: yyyy-mm-dd', name: 'end' },
  {
    type: 'string',
    message: 'please enter out file: <some_name>.csv',
    name: 'outFile'
  },
  {
    type: 'list',
    message: 'please pick either C for crime stats or I for incident stats',
    name: 'mapType',
    choices: ['I', 'C']
  }
];
inquirer
  .prompt(questions)
  .then(async answers => {
    await runTheJewels(
      answers.start,
      answers.end,
      answers.outFile,
      answers.mapType === 'I' ? 1 : 30,
      answers.mapType
    );
  })
  .catch(error => {
    console.log(error);
  });
