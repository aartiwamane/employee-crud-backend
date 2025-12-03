
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Employee = require("./employeeSchema");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

const Employee = mongoose.model('Employee', employeeSchema, 'Emp_Details');

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
.then(() => console.log("Mongodb Connected.."))
.catch((err)=> console.log("Connection error",err))

// GET all employees
app.get('/employee', async (req, res) => {
    try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new employee
app.post('/employee', async (req, res) => { 
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json({ message: 'Employee added', employee: newEmployee });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// DELETE Employee by ID
app.delete('/employee/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully', employee: deletedEmployee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/employee/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const update = {
            name: req.body.name,
            position: req.body.position,
            department: req.body.department
        };

        const updatedEmp = await Employee.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true
        });

        if (!updatedEmp) return res.status(404).json({ message: "Employee not found" });

        res.json(updatedEmp);
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: err.message });
    }
});


// Sample route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = app;