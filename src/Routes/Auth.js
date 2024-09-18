const express= require('express');
const router = express.Router();
const {createUser, validateLogin} = require("../Services/AuthService");
const { validateUser } = require('../Services/utils/Validator');
const {tryCatch, tryCatchAsync} = require('../Services/utils/TryCatch');
router.post("/api/auth/createUser", validateUser, tryCatch((req, res) =>{
    const body= req.body;
    const result = createUser(body);
    return res.status(201).json({
        message:"User created",
        FirstName: body.FirstName,
        token: result.token, // Include the token in the response
        FirstTime: true
    })
}))

router.post("/api/auth/login", tryCatchAsync(async (req, res)=>{
    const {email, password} = req.body;
    const {valid, result} = await validateLogin(email, password);
    if(!valid){
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }
    return res.status(200).json(result)
}) 
);

module.exports = router;