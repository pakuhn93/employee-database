const inquirer = require('inquirer');
const db = require('./db/connection');

const choicesMain = ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role'];
const [menuDepartment, menuRole, menuEmployee] = ['department', 'role', 'employee'];

// navigates back to the main menu if the user confirms
// if the user rejects, exits the program
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

// adds data to an existing table
// parameter takes in a string specifying which table to use
const addData = async (table) => {
    switch(table){
        case menuDepartment:
            await inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'department',
                    message: 'Department to be added:'
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
            break;

        case menuRole:
            await inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'role',
                    message: 'Role to be added:'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: "Enter the role's salary:",
                    validate: function validateNumber(input){
                        if(isNaN(input)){
                            return `\n${input} is not a number value. Please enter a number value.`;
                        } else { return true; }
                    }
                },
                {
                    type: 'input',
                    name: 'department',
                    message: 'Enter the department id of the new role:'
                    // validate: function validateDepartment(input){
                    //     const myQuery = `EXISTS(SELECT 1 FROM department WHERE name = '${input}')`;
                    //     console.log(`\n${myQuery}`);
                    //     db.query(`SELECT ${myQuery}`, (err, res) => {
                    //         if(err){console.log(err);}
                    //         const resStr = JSON.stringify(res);
                    //         console.log(`\n${resStr}`);
                    //         if(resStr.includes(':0}]', 0)){
                    //             return `\n'${input}' is not a valid department.`;
                    //         } else { 
                    //             return true;  
                    //         }
                    //     });
                    // }
                }
            ])
            .then(( {role, salary, department} ) => {
                db.query(`INSERT INTO role (title, salary, department_id) VALUES (${role}, ${salary}, ${department})`, (err, res) => {
                    console.log(`${role} successfully added to the list of roles`);
                    navHome();
                });
            })
            .catch((err) => {
                if(err){
                    console.log('An error has occurred. Please try again.');
                }
            })
            break;
        case menuEmployee:
            break;
        default:
            break;
    }
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
        .then(( {selection} ) => {
            switch (selection){
                // View Departments
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
                // View Roles
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
                // View Employees
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
                // Add Department
                case choicesMain[3]:
                    console.log('Adding department...');
                    addData(menuDepartment);
                    break;
                // Add Role
                case choicesMain[4]:
                    console.log('Adding role...');
                    addData(menuRole);
                    break;
                // Add Employee
                case choicesMain[5]:
                    console.log('Adding employee...');
                    addData(menuEmployee);
                    break;
                // Update Employee
                case choicesMain[6]:
                    console.log('Updating employee...');
                    break;
                // error check
                default:
                    console.log('An internal error has occurred... Please try again.');
                    navHome();
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

// initializes the program
init();