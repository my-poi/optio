UPDATE Schedules
SET 
updatedBy = ?,
updated = ?
WHERE employeeId = ?
AND year = ?
AND month = ?;