import './common/utils/db';
import express from 'express'
const app = express()
import dotenv from 'dotenv'
import cors from 'cors';
import { userSalaryRoutes } from './api/userSalary/userSalaryRoute';
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use('/salary', userSalaryRoutes);


export {app}