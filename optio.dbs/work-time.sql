CREATE DATABASE OptioWorkTime;

USE OptioWorkTime;

CREATE TABLE HolidayTypes (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE Holidays (
  dayOff DATE NOT NULL,
  typeId INT NOT NULL,
  PRIMARY KEY (dayOff),
  CONSTRAINT HolidayTypesHolidays
    FOREIGN KEY (typeId)
    REFERENCES HolidayTypes (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Shifts (
  id INT NOT NULL AUTO_INCREMENT,
  sign VARCHAR(5) NOT NULL,
  isValid BOOL NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY Sign (sign)
);

CREATE TABLE ShiftDurations (
  shiftId INT NOT NULL,
  validFrom DATETIME NOT NULL,
  validTo DATETIME,
  start TIME NOT NULL,
  finish TIME NOT NULL,
  hours TINYINT NOT NULL,
  minutes TINYINT NOT NULL,
  createdBy INT NOT NULL,
  created DATETIME NOT NULL,
  PRIMARY KEY (shiftId, validFrom),
  CONSTRAINT ShiftsShiftDurations
    FOREIGN KEY (shiftId)
    REFERENCES Shifts (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT UsersShiftDurations
    FOREIGN KEY (createdBy)
    REFERENCES OptioSystem.Users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
