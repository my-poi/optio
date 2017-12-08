UPDATE PlannedDays
SET
hours = ?,
minutes = ?,
shiftId = ?,
comment = ?,
updatedBy = ?,
updated = ?
WHERE employeeId = ?
AND day = ?;