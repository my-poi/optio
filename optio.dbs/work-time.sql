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

CREATE TABLE PeriodDefinitions (
  period TINYINT NOT NULL,
  month TINYINT NOT NULL,
  sortOrder TINYINT NOT NULL,
  PRIMARY KEY (period, month)
);

CREATE TABLE Periods (
  year SMALLINT NOT NULL,
  month TINYINT NOT NULL,
  hours SMALLINT NOT NULL,
  days TINYINT NOT NULL,
  PRIMARY KEY (year, month)
);

CREATE TABLE Shifts (
  id TINYINT NOT NULL AUTO_INCREMENT,
  sign VARCHAR(5) NOT NULL,
  isValid BOOL NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY Sign (sign)
);

CREATE TABLE ShiftDurations (
  shiftId TINYINT NOT NULL,
  validFrom DATE NOT NULL,
  validTo DATE,
  start TIME NOT NULL,
  finish TIME NOT NULL,
  hours TINYINT NOT NULL,
  minutes TINYINT NOT NULL,
  PRIMARY KEY (shiftId, validFrom),
  CONSTRAINT ShiftsShiftDurations
    FOREIGN KEY (shiftId)
    REFERENCES Shifts (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Schedules (
  companyUnitId INT NOT NULL,
  employeeId INT NOT NULL,
  year SMALLINT NOT NULL,
  month TINYINT NOT NULL,
  sortOrder TINYINT NOT NULL,
  plannedIsLocked BOOL NOT NULL,
  workedIsLocked BOOL NOT NULL,
  comments VARCHAR(100),
  createdBy INT NOT NULL,
  created DATETIME NOT NULL,
  PRIMARY KEY (employeeId, year, month),
  CONSTRAINT CompanyUnitsCompanyUnitSchedules
    FOREIGN KEY (companyUnitId)
    REFERENCES OptioOrganization.CompanyUnits (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT EmployeesCompanyUnitSchedules
    FOREIGN KEY (employeeId)
    REFERENCES OptioOrganization.Employees (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT UsersCompanyUnitSchedules
    FOREIGN KEY (createdBy)
    REFERENCES OptioSystem.Users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE PlannedDays (
  employeeId INT NOT NULL,
  day DATE NOT NULL,
  planned TIME,
  shiftId TINYINT,
  comments VARCHAR(100),
  updatedBy INT,
  updated DATETIME,
  PRIMARY KEY (employeeId, day),
  CONSTRAINT EmployeesPlannedDays
    FOREIGN KEY (employeeId)
    REFERENCES OptioOrganization.Employees (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT UsersPlannedDays
    FOREIGN KEY (updatedBy)
    REFERENCES OptioSystem.Users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE AbsenceTypes (
  id TINYINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  sign VARCHAR(5) NOT NULL,
  isValid BOOL NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY Name (name),
  UNIQUE KEY Sign (sign)
);

CREATE TABLE WorkedDays (
  employeeId INT NOT NULL,
  day DATE NOT NULL,
  worked TIME,
  night TIME,
  shiftId TINYINT,
  absenceTypeId TINYINT,
  overtimeSurcharge TIME,
  overtimeSundayHoliday TIME,
  overtimeSundayHolidayFreeDay TIME,
  overtimeNight TIME,
  overtimeFree TIME,
  comments VARCHAR(100),
  updatedBy INT,
  updated DATETIME,
  PRIMARY KEY (employeeId, day),
  CONSTRAINT EmployeesWorkedDays
    FOREIGN KEY (employeeId)
    REFERENCES OptioOrganization.Employees (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT ShiftsWorkedDays
    FOREIGN KEY (shiftId)
    REFERENCES Shifts (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT AbsenceTypesWorkedDays
    FOREIGN KEY (absenceTypeId)
    REFERENCES AbsenceTypes (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT UsersWorkedDays
    FOREIGN KEY (updatedBy)
    REFERENCES OptioSystem.Users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Vacations (
  employeeId INT NOT NULL,
  start DATE NOT NULL,
  finish DATE NOT NULL,
  comments VARCHAR(100) NOT NULL,
  isLocked BOOL NOT NULL,
  createdBy INT NOT NULL,
  created DATETIME NOT NULL,
  updatedBy INT,
  updated DATETIME,
  PRIMARY KEY (employeeId, start),
  CONSTRAINT EmployeesVacations
    FOREIGN KEY (employeeId)
    REFERENCES OptioOrganization.Employees (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT UsersVacations1
    FOREIGN KEY (createdBy)
    REFERENCES OptioSystem.Users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT UsersVacations2
    FOREIGN KEY (updatedBy)
    REFERENCES OptioSystem.Users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
