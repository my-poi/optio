SELECT DISTINCT
companyUnitId,
MIN(created) AS created,
MAX(updated) AS updated
FROM Schedules
WHERE year = ?
AND month = ?
GROUP BY companyUnitId;