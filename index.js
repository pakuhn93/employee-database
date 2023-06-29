const inquirer = require('inquirer');
const db = require('./db/connection');

const choicesMain = ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role'];

const navHome = async () => {
    await inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Would you like to return to the main menu?'
            }
        ])
        .then(( {confirm} ) => {
            if(!confirm){
                console.log('Exiting program...');
                process.exit(0);
            }
            init();
        })
        .catch((err) => {
            if (err){ 
                console.log('An error has occurred. Please try again.');
            }
        });
}

const addData = async (table) => {
    await inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'Department Name:'
            }
        ])
        .then(( {department} ) =>{
            db.query(`INSERT INTO department (name) VALUES ('${department}')`, (err, res) => {
                console.log(`'${department}' has been added to the list of departments.`);
                navHome();
            });
        })
        .catch((err) => {
            if(err){
                console.log('An error has occurred. Please try again.');
            }
        });
    
}

// initialize the program
async function init(){
    // console navigation
    await inquirer
        .prompt([
            { // Main Navigation
                type: 'list',
                name: 'selection',
                message: 'Select an Option:',
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
                        } else { 
                            console.table(res);
                            navHome();
                        }
                    });
                    break;

                case choicesMain[1]:
                    console.log('Viewing all roles...');
                    db.query(`SELECT title AS Roles FROM role`, (err, res) => {
                        if(err){
                            console.log('Unable to view data.');
                        } else { 
                            console.table(res);
                            navHome();
                        }
                    });
                    break;

                case choicesMain[2]:
                    console.log('Viewing all employees...');
                    db.query(`SELECT first_name AS First_Name, last_name AS Last_Name FROM employee`, (err, res) => {
                        if(err){
                            console.log('Unable to view data.');
                        } else { 
                            console.table(res);
                            navHome();
                        }
                    });
                    break;

                case choicesMain[3]:
                    console.log('Adding department...');
                    addData();
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