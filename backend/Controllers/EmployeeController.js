const EmployeeModel = require("../Models/EmployeeModel");
const UserModel = require("../Models/UserModel");
const bcrypt = require('bcrypt');
const { options } = require("../Routes/EmployeeRoutes");

const createEmployee = async (req,res)=>{
    try{
        const body = req.body;
        body.profileImage = req.file ? req.file?.path: null;
        console.log("submitted employee", body);
        let hashedPassword;

        if (body.password) {
             hashedPassword = await bcrypt.hash(body. password, 10);
            body.password = hashedPassword;
        } else {
        return res.status(400).json({
        message: 'Password is required',
        success: false
        });
    }
    console.log('Processed employee data:', body);

        const emp = new EmployeeModel(body);
        const savedEmployee = await emp.save();
        const user = new UserModel({
            email: savedEmployee.email,
            password: hashedPassword, // Use the same hashed password
            role: savedEmployee.role, // Set role (likely 'Employee')
            employee: savedEmployee._id, // Store the EmployeeModel's ObjectId for reference
          });
          await user.save();
        res.status(201)
            .json({
                message: "Employee and user created successfully",
                success: true,
            })

    }catch(err){
        console.error('Error creating employee:', err);
        res.status(500).json({
            mesaage: 'Internal server error',
            success: false,
            error: err
        })
    }
}
const updateEmployeeById = async (req,res)=>{
    try{
        const {name, mobile, email, gender, course, desigination } = req.body;
        const {id} = req.params;

        let updateData = {
            name, mobile, email, gender, course, desigination
        }

        if(req.file) {
            updateData.profileImage =req.file.path;
        }
        const updateEmployee = await EmployeeModel.findByIdAndUpdate(
            id,
            updateData,
            {new: true}
        )
        if(!updateEmployee){
            return res.status(404).json({message: 'Employee Not Found'});
        }

        res.status(200)
            .json({
                message: "Employee Updated",
                success: true,
                data: updateEmployee
            });

    }catch(err){
        res.status(500).json({
            mesaage: 'Internal server error',
            success: false,
            error: err
        })
    }
}

const getAllEmployees = async (req,res)=>{
    try{
        let {page, limit, search} = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 5;

        const skip = (page - 1)* limit;
        let searchCriteria = {};
        if(search){
            searchCriteria = {
                name: {
                    $regex: search,
                    $options: 'i'// case insensitive
                }
            }
        }
        const totalEmployees = await EmployeeModel.countDocuments(searchCriteria);

        const emps = await EmployeeModel.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .sort({createdAt: -1});
            const totalPages = Math.ceil(totalEmployees / limit);
        res.status(200)
            .json({
                message: "All Employees",
                success: true,
                data: {
                    employees: emps,
                    pagination:{
                        totalEmployees,
                        currentPage: page,
                        totalPages,
                        pageSize: limit
                    }
                }
            })

    }catch(err){
        res.status(500).json({
            mesaage: 'Internal server error',
            success: false,
            error: err
        })
    }
}

const getEmployeeById = async (req,res)=>{
    try{
        const {id} = req.params;
        const emp = await EmployeeModel.findOne({_id: id});
        res.status(200)
            .json({
                message: "Get Employee details",
                success: true,
                data: emp
            })

    }catch(err){
        res.status(500).json({
            mesaage: 'Internal server error',
            success: false,
            error: err
        })
    }
}
const deleteEmployeeById = async (req,res)=>{
    try{
        const {id} = req.params;
        const emp = await EmployeeModel.findByIdAndDelete({_id: id});
        res.status(200)
            .json({
                message: "Employee Deleted..",
                success: true,
                
            })

    }catch(err){
        res.status(500).json({
            mesaage: 'Internal server error',
            success: false,
            error: err
        })
    }
}

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    deleteEmployeeById,
    updateEmployeeById
}