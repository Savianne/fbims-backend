import express, { RequestHandler } from 'express';
import { IUserRequest } from '../types/IUserRequest';
import { OkPacket, RowDataPacket } from "mysql2";
import pool from '../mysql/pool';
import { io } from '..';
import addCategoryTransactionPromise from '../mysql/addAttendanceCategory';
import getCongregationAttendanceCategories from '../mysql/getCongregationAttendanceCategories';
import getAttendanceCategoryAttenders from '../mysql/getAttendanceCategoryAttenders';
import deleteAttendanceCategory from '../mysql/deleteAttendanceCategory';
import addAttendanceEntry from '../mysql/addAttendanceEntry';
import getCategoryTotalEntries from '../mysql/getCategoryTotalEntries';
import getAttendanceCategoryByUid from '../mysql/getAttendanceCategoryByUid';
import updateMinistryDisplayPictureHandler from '../request-handler/update-ministry-dp-handler';

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

AttendanceRouter.get("/get-attendance-category/:uid", async (req, res) => {
    const uid = req.params.uid;

    try {
        const result = await getAttendanceCategoryByUid(uid);

        if(result.success) {
            res.json({
                success: true,
                data: result.result
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


AttendanceRouter.get("/congregation-attendance-category", async (req, res) => {
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

AttendanceRouter.post('/add-attendance-entry', async (req, res) => {
    const entryData = req.body;
    const request = req as IUserRequest
    const congregationUID = request.user?.congregation;

    try {
        const result = await addAttendanceEntry(entryData);

        if(result.querySuccess) {
            io.emit(`${congregationUID}-ADDED_NEW_ATTENDANCE_ENTRY`, {entryUID: result.entryUID, category: entryData.categoryUID, id: new Date().getTime()});
            res.json({
                success: true,
                entryUID: result.entryUID
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

AttendanceRouter.get("/get-attendance-category-total-entries/:categoryUID", async (req, res) => {
    const categoryUID = req.params.categoryUID;

    try {
        const result = await getCategoryTotalEntries(categoryUID);
        res.json({
            success: true,
            data: result.totalEntries
        })
    }
    catch(err) {
        res.json(err)
    }
});

AttendanceRouter.patch("/update-category-title/:categoryUID", async (req, res) => {
    const categoryUID = req.params.categoryUID;
    const title = req.body.title;

    const promisePool = pool.promise();
    try {
        await promisePool.query("UPDATE attendance_categories SET title = ? WHERE uid = ?", [title || null, categoryUID]);
        res.json({
            success: true
        })
    }
    catch(err) {
        console.log(err)
        res.json({
            success: false,
            error: err
        })
    }

});

AttendanceRouter.get("/get-pending-attendance-entries", async (req, res) => {
    const request = req as IUserRequest
    const congregationUID = request.user?.congregation;

    const promisePool = pool.promise();
    try {
        const result = ((await promisePool.query(`
            SELECT 
                pae.entry_uid AS entryUID, 
                ac.uid AS categoryUID, 
                ac.title AS categoryTitle, 
                ac.type, 
                ac.attender, 
                ae.description, 
                ae.date
            FROM pending_attendance_entries AS pae
            JOIN attendance_entries AS ae ON pae.entry_uid = ae.entry_uid
            JOIN attendance_categories AS ac ON ae.category_uid = ac.uid
            JOIN congregation_attendance_category AS cac ON ac.uid = cac.category_uid
            WHERE cac.congregation_uid = ?
        `, [congregationUID])) as RowDataPacket[])[0]

        res.json({
            data: result,
            success: true
        })

        
    }
    catch(err) {
        console.log(err)
        res.json({
            success: false,
            error: err
        })
    }

})
export default AttendanceRouter;