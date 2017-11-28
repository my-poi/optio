USE OptioWorkTime;

INSERT INTO Shifts VALUES (1, 'I', 1);
INSERT INTO Shifts VALUES (2, 'II', 1);
INSERT INTO Shifts VALUES (3, 'III', 1);
INSERT INTO Shifts VALUES (4, 'IV', 1);
INSERT INTO Shifts VALUES (5, 'V', 1);
INSERT INTO Shifts VALUES (6, 'VI', 1);
INSERT INTO Shifts VALUES (7, 'VII', 1);
INSERT INTO Shifts VALUES (8, 'VIII', 1);
INSERT INTO Shifts VALUES (9, 'IX', 1);
INSERT INTO Shifts VALUES (10, 'X', 1);
INSERT INTO Shifts VALUES (11, 'XI', 1);
INSERT INTO Shifts VALUES (12, 'XII', 1);
INSERT INTO Shifts VALUES (13, 'XIII', 1);
INSERT INTO Shifts VALUES (14, 'XIV', 1);
INSERT INTO Shifts VALUES (15, 'XV', 0);
INSERT INTO Shifts VALUES (16, 'XVI', 0);
INSERT INTO Shifts VALUES (17, 'XVII', 0);
INSERT INTO Shifts VALUES (18, 'XVIII', 0);
INSERT INTO Shifts VALUES (19, 'XIX', 0);
INSERT INTO Shifts VALUES (20, 'XX', 0);

INSERT INTO ShiftDurations VALUES (1, '2017-01-01', '2017-04-03', '06:00', '14:00', 8, 0);
INSERT INTO ShiftDurations VALUES (1, '2017-04-04', NULL, '06:30', '14:30', 8, 0);
INSERT INTO ShiftDurations VALUES (2, '2017-01-01', '2017-04-10', '14:00', '22:00', 8, 0);
INSERT INTO ShiftDurations VALUES (2, '2017-04-11', NULL, '14:00', '23:00', 9, 0);
INSERT INTO ShiftDurations VALUES (3, '2017-01-01', NULL, '22:00', '06:00', 8, 0);
INSERT INTO ShiftDurations VALUES (4, '2017-01-01', NULL, '07:00', '15:00', 8, 0);
INSERT INTO ShiftDurations VALUES (5, '2017-01-01', NULL, '13:00', '21:00', 8, 0);
INSERT INTO ShiftDurations VALUES (6, '2017-01-01', NULL, '07:30', '15:30', 8, 0);
INSERT INTO ShiftDurations VALUES (7, '2017-01-01', NULL, '08:00', '20:00', 12, 0);
INSERT INTO ShiftDurations VALUES (8, '2017-01-01', NULL, '20:00', '08:00', 12, 0);
INSERT INTO ShiftDurations VALUES (9, '2017-01-01', NULL, '10:00', '18:00', 8, 0);
INSERT INTO ShiftDurations VALUES (10, '2017-01-01', NULL, '12:00', '20:00', 8, 0);
INSERT INTO ShiftDurations VALUES (11, '2017-01-01', NULL, '08:00', '15:30', 7, 30);
INSERT INTO ShiftDurations VALUES (12, '2017-01-01', NULL, '17:00', '05:00', 12, 0);
INSERT INTO ShiftDurations VALUES (13, '2017-01-01', NULL, '18:00', '02:00', 8, 0);
INSERT INTO ShiftDurations VALUES (14, '2017-01-01', NULL, '00:00', '08:00', 8, 0);


