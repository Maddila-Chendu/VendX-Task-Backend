import { Request, Response } from 'express';
import { pool } from './database';

const bcrypt = require('bcrypt');
const saltRounds = 10;

  async function hashPassword(Password:any) {
    const hashedPassword = await bcrypt.hash(Password, saltRounds)
    return hashedPassword;
    
  }
export const registerUser = async (req: Request, res: Response) => {
  const { FirstName, LastName, username, Password } = req.body;
  const hashedPassword = await hashPassword(Password); 
  try {

    const checkQuery = `SELECT * FROM public."login" WHERE username = $1;`;
    const checkResult = await pool.query(checkQuery, [username]);
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const query = `INSERT INTO public."login" ("First_Name", "Last_Name", username, "Password") VALUES ($1, $2, $3, $4) RETURNING *;`;
    const result = await pool.query(query, [FirstName, LastName, username, hashedPassword]);
    res.status(201).json({ message: "Registered Successfully", data: result.rows[0] });
   
  } 
  catch (error: any) {
    console.error(error);
    if (error.code === '23505') {
      res.status(400).json({ error: "Error while Creating Password...Create a new Password" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }

};

async function compare(inputPassword:any, storedPassword:any) {
  const isCompare = await bcrypt.compare(inputPassword,storedPassword)
  return isCompare;
  
}
export const loginUser = async (req: Request, res: Response) => {
  const { username, Password } = req.body;
  try {
    const query = `SELECT * FROM public."login" WHERE username = $1`;
    const result = await pool.query(query, [username]);

    console.log(result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found... Please Register" });
    }

    const user = result.rows[0];
    const isValid = await compare(Password,user.Password);
   
    if (!isValid) {
      return res.status(401).json({ error: "Invalid Username (or) Password" });
    }

    res.status(200).json({ message: "Login Successfull", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};