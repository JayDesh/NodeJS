select 
p.Part_Number__c as Renewal_SKU,
p.name as Description,
p.Desktop_Renewal_SKU_Key__c as key ,
p.sfid
from 
salesforce.PRODUCT2 p
JOIN salesforce.RECORDTYPE r on (r.sfid = p.RecordTypeid)
where p.Material_Group__c='TERM_BNDL' and p.sales_license_type_code__c='TRN' and r.NAME = 'Product SKU' 
and (p.special_sales_program_type__c is null or p.special_sales_program_type__c='') 
and  p.Desktop_Renewal_SKU_Key__c in 