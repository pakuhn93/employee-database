const inquirer = require('inquirer');
const db = require('./db/connection');

const choicesMain = ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role'];

// initialize the program
function init(){
    // console navigation
    inquirer
        .prompt([
            { // Main Navigation
                type: 'list',
                name: 'selection',
                message: 'What would you like to do?',
                choices: choicesMain
            }
        ])
        // based on selection from above prompt, decide what to do
        // CONSIDER changing switch to for loop with if conditional inside
        .then(( {selection} ) => {
            switch (selection){
                case choicesMain[0]:
                    console.log('Viewing all departments...');
                    db.query(`SELECT name AS Departments FROM department`, (err, res) => {
                        if(err){ 
                            console.log('Unable to view data.'); 
                        } else { console.table(res); }
                    });
                    break;

                case choicesMain[1]:
                    console.log('Viewing all roles...');
                    db.query(`SELECT title AS Roles FROM role`, (err, res) => {
                        if(err){
                            console.log('Unable to view data.');
                        } else { console.table(res); }
                    });
                    break;

                case choicesMain[2]:
                    console.log('Viewing all employees...');
                    db.query(`SELECT first_name AS First, last_name AS Last FROM employee`, (err, res) => {
                        if(err){
                            console.log('Unable to view data.');
                        } else { console.table(res); }
                    });
                    break;

                case choicesMain[3]:
                    console.log('Adding department...');
                    break;

                case choicesMain[4]:
                    console.log('Adding role...');
                    break;

                case choicesMain[5]:
                    console.log('Adding employee...');
                    break;

                case choicesMain[6]:
                    console.log('Updating employee...');
                    break;

                default:
                    console.log('An internal error has occurred... Please try again.');
                    break;
            }
        })
        .catch((err) => {
            if(err.isTtyError){
                console.log('Prompt was unable to be rendered... Please try again.');
            } else { console.log('An unkown error has occurred... Please try again.');
        }
        });
}

init();