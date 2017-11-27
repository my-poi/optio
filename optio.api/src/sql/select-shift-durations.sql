SELECT   
  shiftId, 
  DATE_FORMAT(validFrom, '%Y-%m-%d') as validFrom, 
  DATE_FORMAT(validTo, '%Y-%m-%d') as validTo, 
  TIME_FORMAT(start, '%H:%i') as start,
  TIME_FORMAT(finish, '%H:%i') as finish,
  hours, 
  minutes  
FROM ShiftDurations;