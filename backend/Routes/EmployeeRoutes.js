const { createEmployee, getAllEmployees, getEmployeeById, deleteEmployeeById, updateEmployeeById } = require('../Controllers/EmployeeController');
const { cloudinaryFileUploader } = require('../Middleware/FileUploader');

const routes = require('express').Router();

routes.get('/', getAllEmployees );

routes.get('/:id', getEmployeeById );
routes.delete('/:id', deleteEmployeeById );

routes.post('/', cloudinaryFileUploader.single('profileImage'), createEmployee);

routes.put('/:id', cloudinaryFileUploader.single('profileImage'), updateEmployeeById);

module.exports = routes;