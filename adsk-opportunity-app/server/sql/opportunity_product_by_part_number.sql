select 
p.Part_Number__c as Renewal_SKU,
p.name as Description,
p.Maintenance_Renewal_SKU_Key__c as key,
p.sfid
from 
salesforce.PRODUCT2 p
JOIN salesforce.RECORDTYPE r on (r.sfid = p.RecordTypeid)
where r.NAME = 'Product SKU' and (p.special_sales_program_type__c is null or p.special_sales_program_type__c='') and 
p.Part_Number__c in 