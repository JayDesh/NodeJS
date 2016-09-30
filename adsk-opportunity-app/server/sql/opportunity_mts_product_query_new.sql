select 
p.Part_Number__c as Renewal_SKU,
p.name as Description,
p.Maintenance_Renewal_SKU_Key__c as key,
p.sfid
from 
salesforce.PRODUCT2 p
JOIN salesforce.RECORDTYPE r on (r.sfid = p.RecordTypeid)
where p.Material_Group__c='SUBSCRPTN' and p.Service_Type__c = 'AA' and p.Service_Sales_Type__c='R' and r.NAME = 'Product SKU' and (p.Billing_Behavior__c IS NULL or p.Billing_Behavior__c = '')  and 
(p.special_sales_program_type__c is null or p.special_sales_program_type__c='') and 
p.Maintenance_Renewal_SKU_Key__c in 