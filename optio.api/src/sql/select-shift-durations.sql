SELECT 
  shiftId, 
  DATE_FORMAT(validFrom, '%Y-%m-%d') AS validFrom, 
  DATE_FORMAT(validTo, '%Y-%m-%d') AS validTo, 
  TIME_FORMAT(start, '%H:%i') AS start, 
  TIME_FORMAT(finish, '%H:%i') AS finish, 
  hours, 
  minutes 
FROM ShiftDurations;