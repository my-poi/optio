USE OptioSystem;

INSERT INTO Users VALUES (1, 'optio', 'Serwis Optio', 'serwis@optio.xyz', 'PzsI7KYsIddiVubh0Li/mfTvvjdvZDNbcvQWOo/FDbo=', NULL, NULL, NULL, 0, 1, '2017-03-21 08:00:00');
INSERT INTO Users VALUES (2, 'm.tokarz', 'Maciej Tokarz', 'maciej.tokarz@my-poi.pl', 'PzsI7KYsIddiVubh0Li/mfTvvjdvZDNbcvQWOo/FDbo=', NULL, NULL, NULL, 0, 1, '2017-03-21 08:00:00');

INSERT INTO Roles VALUES (1, 'super-administrator', 'Super Administrator');
INSERT INTO Roles VALUES (2, 'administrator', 'Administrator');
INSERT INTO Roles VALUES (3, 'manager', 'Kierownik');
INSERT INTO Roles VALUES (4, 'employee', 'Pracownik');

INSERT INTO UsersInRoles VALUES (1, 1);
INSERT INTO UsersInRoles VALUES (2, 2);
