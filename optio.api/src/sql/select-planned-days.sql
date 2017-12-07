SELECT 
  employeeId,
  DATE_FORMAT(day, '%Y-%m-%d') AS day,
  planned,
  shiftId,
  comments,
  updatedBy,
  updated
FROM PlannedDays
WHERE FIND_IN_SET(employeeId, ?) > 0
AND day >= ?
AND day <= ?;