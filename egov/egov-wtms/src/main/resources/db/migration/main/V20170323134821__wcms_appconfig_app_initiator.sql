INSERT INTO eg_appconfig ( ID, KEY_NAME, DESCRIPTION, VERSION, MODULE ) VALUES (nextval('SEQ_EG_APPCONFIG'),'WCMSDESIGNATIONFORINITIATOR', 'Designation for WCMS initiator',0, (select id from eg_module where name='Water Tax Management'));

INSERT INTO eg_appconfig_values ( ID, KEY_ID, EFFECTIVE_FROM, VALUE, VERSION ) VALUES (nextval('SEQ_EG_APPCONFIG_VALUES'), (SELECT id FROM EG_APPCONFIG WHERE KEY_NAME='WCMSDESIGNATIONFORINITIATOR' and module=(select id from eg_module where name='Water Tax Management')), current_date, 'Junior Assistant,Senior Assistant',0);