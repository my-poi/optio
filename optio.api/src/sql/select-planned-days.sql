SELECT 
  employeeId,
  DATE_FORMAT(day, '%Y-%m-%d') AS day,
  planned,
  shiftId,
  comments,
  updatedBy,
  updated
FROM PlannedDays
WHERE employeeId IN ?
AND day >= ?
AND day <= ?;