insert into eg_action(id,name,url,queryparams,parentmodule,ordernumber,displayname,enabled,contextroot,version,createdby,createddate,lastmodifiedby,lastmodifieddate,application) values (nextval('SEQ_EG_ACTION'),'findDesignations-byDepartment','/workflow/ajaxWorkFlow-findDesignationsByObjectType.action',null,(select id from eg_module where name='EIS-COMMON'),1,'findDesignations-byDepartment',false,'eis',0,(select id from eg_user where username = 'system'),now(),(select id from eg_user where username = 'system'),now(),(select id from eg_module where name = 'EIS'));
insert into eg_roleaction values ((select id from eg_role where name='SYSTEM'),(select id from eg_action where name='findDesignations-byDepartment' and contextroot='eis'));