INSERT into state.eg_role select nextval('state.seq_eg_role'),'Employee Admin','Employee Admin',now(),1,1,now(),0, false where not exists (select * from state.eg_role where name='Employee Admin');
	INSERT into state.eg_role select nextval('state.seq_eg_role'),'EIS Report Viewer','EIS Report Viewer',now(),1,1,now(),0, false where not exists (select * from state.eg_role where name='EIS Report Viewer');
	INSERT INTO state.eg_role select nextval('state.seq_eg_role'), 'EIS_VIEW_ACCESS', 'user has access to view masters, reports data, etc', now(), 1, 1, now(), 0, false where not exists (select * from state.eg_role where name='EIS_VIEW_ACCESS');
	INSERT into state.eg_role select nextval('state.seq_eg_role'),'DPO Modification Features','DPO Modification Features',now(),1,1,now(),0, false where not exists (select * from state.eg_role where name='DPO Modification Features');