import express, { RequestHandler } from 'express';
import { IUserRequest } from '../types/IUserRequest';

import addCategoryTransactionPromise from '../mysql/addAttendanceCategory';
import getCongregationAttendanceCategories from '../mysql/getCongregationAttendanceCategories';
import getAttendanceCategoryAttenders from '../mysql/getAttendanceCategoryAttenders';
import deleteAttendanceCategory from '../mysql/deleteAttendanceCategory';

const AttendanceRouter = express.Router();

AttendanceRouter.use((req, res, next) => {
    const request = req as IUserRequest
    if(!request.user) {
        return res.status(401).json({
            error: "Unautorized Request!"
        })
    }
    else next()
});

AttendanceRouter.post('/add-attendance-category', async (req, res) => {
    const data = req.body;
    const request = req as IUserRequest;

    try {
        const result = await addCategoryTransactionPromise(request.user?.congregation as string, data);

        if(result.querySuccess) {
            res.json({
                success: true,
                data: result.uid
            });  
        } else throw result.error
    }
    catch(err) {
        console.log(err)
        res.json({
            success: false,
            error: err
        });
    }
});

AttendanceRouter.get("/congregation-attendance-categoty", async (req, res) => {
    const request = req as IUserRequest;
    try {
        const result = await getCongregationAttendanceCategories(request.user?.congregation as string);

        if(result.querySuccess) {
            res.json({
                success: true,
                data: result.data
            });  
        } else throw result.error
    }
    catch(err) {
        console.log(err)
        res.json({
            success: false,
            error: err
        });
    }
})

AttendanceRouter.get("/attendance-categoty-attenders/:uid", async (req, res) => {
    const uid = req.params.uid;

    try {
        const result = await getAttendanceCategoryAttenders(uid);

        if(result.querySuccess) {
            res.json({
                success: true,
                data: result.data
            });  
        } else throw result.error
    }
    catch(err) {
        console.log(err)
        res.json({
            success: false,
            error: err
        });
    }
});

AttendanceRouter.delete("/delete-attendance-category/:uid", async (req, res) => {
    const uid = req.params.uid;

    try {
        const result = await deleteAttendanceCategory(uid);

        if(result.querySuccess) {
            res.json({
                success: true
            });  
        } else throw result.error
    }
    catch(err) {
        console.log(err)
        res.json({
            success: false,
            error: err
        });
    }
})

export default AttendanceRouter;