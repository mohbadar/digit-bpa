update EGP_PORTALSERVICE set url ='/wtms/search/waterSearch/commonSearch/additionalconnection' where name ='Apply for Additional Connection' and module=(select id from eg_module where name='Water Tax Management');
update EGP_PORTALSERVICE set url ='/wtms/search/waterSearch/commonSearch/changeofuse' where name ='Apply for Change of Use' and module=(select id from eg_module where name='Water Tax Management');
update EGP_PORTALSERVICE set url ='/wtms/search/waterSearch/commonSearch/closureconnection' where name ='Apply for Closure of Connection' and module=(select id from eg_module where name='Water Tax Management');
update EGP_PORTALSERVICE set url ='/wtms/search/waterSearch/commonSearch/reconnection' where name ='Apply for Re-Connection' and module=(select id from eg_module where name='Water Tax Management');