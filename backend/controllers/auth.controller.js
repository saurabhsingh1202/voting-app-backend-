const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.register = async(req ,res)=>{
const {username,email, password,role } = req.body;
try{
  const hashedPassword= await bcrypt.hash(password, 10);
  const user= new User({username,email,password:hashedPassword,role});
  await user.save();
  res.status(201).json({message: 'User created successfully'});
}
catch(err) {
  console.error('Error registering user:', err);
  res.status(500).json({message: 'Server Error: Could not create user'});
}


};
exports.login = async(req ,res)=>{
const {email, password} = req.body;
try {
  const user = await User.findOne({email});
  if(!user) return res.status(404).json({message: 'user not found'});

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(404).json({message: 'invalid credentials'});

  const token =jwt.sign({id: user.id, role:user.role},process.env.jWT_SECRET,{expiresIn: '1h'});
  res.status(200).json({token,user:{id: user.id,username:user.username, role:user.role}});
} catch (err) {
  res.status(500).json({message: err.message});
}
};
exports.logout =async (req, res) =>{
  res.clearCookie('token');
  res.status(200).json({message: 'Logged out successfully'});
}