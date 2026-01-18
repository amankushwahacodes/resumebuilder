import { json } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

// POST : api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // return success message
    const token = generateToken(newUser._id);
    newUser.password = undefined;

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// POST : api/users/login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    if (!user.comparePassword(password)) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);
    user.password = undefined;

    return res.status(200).json({message : 'Login successfull',token, user})


  } catch (error) {
    return res.status(400).json({message : error.message})
  }
};

// GET : /api/users/data

export const getUserById = async(req,res) =>{
    try{
        const userId = req.userId;

        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({message : 'User not found'})
        }

        user.password = undefined;

        return res.status(200).json({user});

    }
    catch(error){
        return res.status(400).json({message : error.message})
    }
}

// controller for getting user resumes
// GET : /api/users/resumes

export const getUserResumes = async (req,res) =>{
  try{
    const userId = req.userId;

    const resumes = await Resume.find({userId})
    return res.status(200).json({
      resumes
    })

  }
  catch (error){
    return res.status(400).json({message : error.message})
  }
}
