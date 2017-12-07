SELECT 
  employeeId,
  DATE_FORMAT(day, '%Y-%m-%d') AS day,
  hours,
  minutes,
  shiftId,
  comment,
  updatedBy,
  updated
FROM PlannedDays
WHERE employeeId IN ?
AND day >= ?
AND day <= ?;