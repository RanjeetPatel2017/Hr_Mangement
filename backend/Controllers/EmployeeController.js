const EmployeeModel = require("../Models/EmployeeModel");
const { options } = require("../Routes/EmployeeRoutes");

const createEmployee = async (req,res)=>{
    try{
        const body = req.body;
        body.profileImage = req.file ? req.file?.path: null;
        console.log(body);
        const emp = new EmployeeModel(body);
        await emp.save();
        res.status(201)
            .json({
                message: "Employee created",
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