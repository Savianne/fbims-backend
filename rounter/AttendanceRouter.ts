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
import getAttendanceEntriesByCategory from '../mysql/getAttendanceEntriesByCategory';
import addPresent from '../mysql/addPresent';
import addTimeIn from '../mysql/addTimeIn';
import addTimeOut from '../mysql/addTimeOut';
import deleteAttendanceEntrySession from '../mysql/deleteAttendanceEntrySession';
import savePendingEntry from '../mysql/savePendingEntry';

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

AttendanceRouter.post("/add-attendance-category-attender/:categoryUID", async (req, res) => {
    const categoryUID = req.params.categoryUID;
    const memberUID = req.body.memberUID;

    const promisePool = pool.promise();
    try {
        await promisePool.query("INSERT INTO attendance_category_attenders (member_uid, category_id) VALUES(?, ?)", [memberUID, categoryUID]);
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

AttendanceRouter.delete("/remove-category-attender/:categoryUID/:memberUID", async (req, res) => {
    const categoryUID = req.params.categoryUID;
    const memberUID = req.params.memberUID;
    const promisePool = pool.promise();
    try {
        await promisePool.query("DELETE FROM attendance_category_attenders WHERE member_uid = ? AND category_id = ?", [memberUID, categoryUID]);
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
})

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

AttendanceRouter.patch("/update-entry-title/:entryUID", async (req, res) => {
    const entryUID = req.params.entryUID;
    const title = req.body.title;

    const promisePool = pool.promise();
    try {
        await promisePool.query("UPDATE attendance_entries SET description = ? WHERE entry_uid = ?", [title || null, entryUID]);
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

AttendanceRouter.post("/add-entry-session/:entryUID", async (req, res) => {
    const entryUID = req.params.entryUID;
    const request = (req as unknown) as IUserRequest
    const congregationUID = request.user?.congregation;
    const promisePool = pool.promise();
    try {
        const id = ((await promisePool.query("INSERT INTO entry_session (entry_uid) VALUES(?)", [entryUID]))[0] as OkPacket).insertId;
        io.emit(`${congregationUID}-ADDED_NEW_ATTENDANCE_ENTRY_SESSION-${entryUID}`)
        res.json({
            success: true,
            id: id
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

AttendanceRouter.get("/get-pending-attendance-entries/:index", async (req, res) => {
    const request = (req as unknown) as IUserRequest
    const congregationUID = request.user?.congregation;

    const index = req.params.index;

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
            LIMIT ?, ?
        `, [congregationUID, +index || 0, 5])) as RowDataPacket[][])[0]

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
});

AttendanceRouter.get("/get-total-pending-attendance-entries", async (req, res) => {
    const request = (req as unknown) as IUserRequest
    const congregationUID = request.user?.congregation;

    const promisePool = pool.promise();
    try {
        const rows = ((await promisePool.query(`
            SELECT 
                COUNT(*) AS total
            FROM pending_attendance_entries AS pae
            JOIN attendance_entries AS ae ON pae.entry_uid = ae.entry_uid
            JOIN attendance_categories AS ac ON ae.category_uid = ac.uid
            JOIN congregation_attendance_category AS cac ON ac.uid = cac.category_uid
            WHERE cac.congregation_uid = ?
        `, [congregationUID])) as RowDataPacket[])[0][0].total

        res.json({
            data: rows,
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

AttendanceRouter.get("/get-entry-sessions/:entryUID", async (req, res) => {
    const entryUID = req.params.entryUID;

    const promisePool = pool.promise();
    try {
        const rows = ((await promisePool.query(`
            SELECT id FROM entry_session WHERE entry_uid = ?
        `, [entryUID])) as RowDataPacket[])[0]

        res.json({
            data: rows,
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

AttendanceRouter.post("/get-attendance-entries-by-category/:categoryUID/:index", async (req, res) => {
    const request = (req as unknown) as IUserRequest
    const congregationUID = request.user?.congregation;

    const categoryUID = req.params.categoryUID;
    const index = req.params.index;

    const dateRangeFilter = req.body.dateRangeFilter as {from: string, to:string} | null

    try {
        const result = await getAttendanceEntriesByCategory(congregationUID as string, categoryUID, +index, dateRangeFilter)
        res.json({
            data: result.data,
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

AttendanceRouter.get("/get-basic-attendance-present-attendees/:entryUID", async (req, res) => {
    const entryUID =req.params.entryUID;

    const promisePool = pool.promise();
    try {
        const result = ((await promisePool.query(`
            SELECT ba.entry_session AS entrySession, ba.entry_uid AS entryUID, m.member_uid AS memberUID, a.avatar AS picture, CONCAT_WS(' ', fn.first_name, LEFT(fn.middle_name, 1), ". ", fn.surname, fn.ext_name) AS name
            FROM basic_attendance AS ba
            JOIN members AS m ON ba.member_uid = m.member_uid
            JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
            JOIN full_name AS fn ON mpi.full_name = fn.id
            LEFT JOIN avatar AS a ON m.avatar = a.id
            WHERE ba.entry_uid = ?
        `, [entryUID])) as RowDataPacket[][])[0]

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
});

AttendanceRouter.get("/get-detailed-attendance-attendees/:entryUID", async (req, res) => {
    const entryUID =req.params.entryUID;

    const promisePool = pool.promise();
    try {
        const result = ((await promisePool.query(`
            SELECT da.id, da.entry_session AS entrySession, da.entry_uid AS entryUID, da.time_in AS timeIn, da.time_out AS timeOut, m.member_uid AS memberUID, a.avatar AS picture, CONCAT_WS(' ', fn.first_name, LEFT(fn.middle_name, 1), ". ", fn.surname, fn.ext_name) AS name
            FROM detailed_attendance AS da
            JOIN members AS m ON da.member_uid = m.member_uid
            JOIN members_personal_info AS mpi ON m.personal_info = mpi.id
            JOIN full_name AS fn ON mpi.full_name = fn.id
            LEFT JOIN avatar AS a ON m.avatar = a.id
            WHERE da.entry_uid = ?
        `, [entryUID])) as RowDataPacket[][])[0]

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
});

AttendanceRouter.post('/add-present', async (req, res) => {
    const request = (req as unknown) as IUserRequest
    const congregationUID = request.user?.congregation;
    const data = req.body;

    try {
        const result = await addPresent(congregationUID as string, data.categoryUID, data);

        if(result.querySuccess) {
            io.emit(`${congregationUID}-NEW_PRESENT_${data.entryUID}`, {...result.profile, entrySession: data.session, entryUID: data.entryUID})
            io.emit(`${congregationUID}-NEW_PRESENT`, {...result.profile, entrySession: data.session, entryUID: data.entryUID})
            res.json({
                success: true,
            });  
        } else throw result
    }
    catch(err) {
        console.log(err)
        const queryError = (err as unknown) as {error: any}
        res.json({
            success: false,
            error: queryError.error
        });
    }
});

AttendanceRouter.post('/add-time-in', async (req, res) => {
    const request = (req as unknown) as IUserRequest
    const congregationUID = request.user?.congregation;
    const data = req.body;

    try {
        const result = await addTimeIn(congregationUID as string, data.categoryUID, data);

        if(result.querySuccess) {
            io.emit(`${congregationUID}-NEW_TIMEIN_${data.entryUID}`, {...result.profile, entrySession: data.session, entryUID: data.entryUID})
            io.emit(`${congregationUID}-NEW_TIMEIN`, {...result.profile, entrySession: data.session, entryUID: data.entryUID})
            res.json({
                success: true,
            });  
        } else throw result
    }
    catch(err) {
        console.log(err)
        const queryError = (err as unknown) as {error: any}
        res.json({
            success: false,
            error: queryError.error
        });
    }
});

AttendanceRouter.post('/add-time-out', async (req, res) => {
    const request = (req as unknown) as IUserRequest
    const congregationUID = request.user?.congregation;
    const data = req.body;

    try {
        const result = await addTimeOut(congregationUID as string, data.categoryUID, data);

        if(result.querySuccess) {
            io.emit(`${congregationUID}-NEW_TIMEOUT_${data.entryUID}`, {...result.profile, entrySession: data.session, entryUID: data.entryUID})
            io.emit(`${congregationUID}-NEW_TIMEOUT`, {...result.profile, entrySession: data.session, entryUID: data.entryUID})
            res.json({
                success: true,
            });  
        } else throw result.error
    }
    catch(err) {
        console.log(err)
        const queryError = (err as unknown) as {error: any}
        res.json({
            success: false,
            error: queryError.error
        });
    }
});


AttendanceRouter.delete('/remove-present/:entryUID/:memberUID', async (req, res) => {
    const request = (req as unknown) as IUserRequest
    const congregationUID = request.user?.congregation;
    const entryUID = req.params.entryUID;
    const memberUID = req.params.memberUID;

    const promisePool = pool.promise();
    try {
        await promisePool.query("DELETE FROM basic_attendance WHERE entry_uid = ? AND member_uid = ?", [entryUID, memberUID]);
        io.emit(`${congregationUID}-REMOVED_PRESENT_${entryUID}`)
        res.json({
            success: true
        })
    }
    catch(err) {
        console.log(err)
        res.json({
            success: false,
            error: err
        });
    }
});

AttendanceRouter.delete('/remove-time-in-out/:entryUID/:memberUID', async (req, res) => {
    const request = (req as unknown) as IUserRequest
    const congregationUID = request.user?.congregation;
    const entryUID = req.params.entryUID;
    const memberUID = req.params.memberUID;

    const promisePool = pool.promise();
    try {
        await promisePool.query("DELETE FROM detailed_attendance WHERE entry_uid = ? AND member_uid = ?", [entryUID, memberUID]);
        io.emit(`${congregationUID}-REMOVED_TIMEINOUT_${entryUID}`)
        res.json({
            success: true
        })
    }
    catch(err) {
        console.log(err)
        res.json({
            success: false,
            error: err
        });
    }
});

AttendanceRouter.delete('/delete-attendance-entry-session/:type/:entryUID/:session', async (req, res) => {
    const request = (req as unknown) as IUserRequest
    const congregationUID = request.user?.congregation;
    const entryUID = req.params.entryUID;
    const session = req.params.session;
    const type = req.params.type;

    try {
        const result = await deleteAttendanceEntrySession(entryUID, type as "basic" | "detailed", +session);

        if(result.querySuccess) {
            io.emit(`${congregationUID}-DELETED_ATTENDANCE_ENTRY_SESSION-${entryUID}`)
            res.json({
                success: true,
            });  
        } else throw result.error
    }
    catch(err) {
        const error = err as {
            querySuccess: false,
            error: any,
        }
        console.log(error.error)
        res.json({
            success: false,
            error: error.error
        });
    }
});

AttendanceRouter.delete('/remove-time-in-out-by-id/:entryUID/:memberUID/:id', async (req, res) => {
    const request = (req as unknown) as IUserRequest
    const congregationUID = request.user?.congregation;
    const id = req.params.id;
    const entryUID = req.params.entryUID;
    const memberUID = req.params.memberUID;

    const promisePool = pool.promise();

    try {
        await promisePool.query("DELETE FROM detailed_attendance WHERE id = ? AND entry_uid = ? AND member_uid = ?", [id, entryUID, memberUID]);

        io.emit(`${congregationUID}-REMOVED_TIMEINOUT_${entryUID}`)
        res.json({
            success: true,
        });  
    }
    catch(err) {
        console.log(err)
        res.json({
            success: false,
            error: err
        });
    }
});

AttendanceRouter.post('/save-attendance-entry/:entryUID/:categoryUID', async (req, res) => {
    const request = (req as unknown) as IUserRequest
    const congregationUID = request.user?.congregation;
    const entryUID = req.params.entryUID;
    const categoryUID = req.params.categoryUID;

    try {
        const result = await savePendingEntry(entryUID)

        if(result.querySuccess) {
            io.emit(`${congregationUID}-ENTRY_SAVED`, {category: categoryUID})
            res.json({
                success: true,
            });  
        } else throw result.error
    }
    catch(err) {
        const error = err as {
            querySuccess: false,
            error: any,
        }
        console.log(error.error)
        res.json({
            success: false,
            error: error.error
        });
    }
});

export default AttendanceRouter;