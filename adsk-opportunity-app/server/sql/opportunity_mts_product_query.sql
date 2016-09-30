select o.OPPORTUNITY_NUMBER__C,
       b.Product_SKU__c as subscription_SKU_Id,
       d.Part_Number__c as subscription_SKU,
       d.Billing_Behavior__c as subscription_SKU_Product_Billing_Behavior,
       a.id as LineItemId,
       o.id as opptyId,
       s.ID as agreementId,
       d.product_line_code__c,
       d.USAGE_TYPE__c,
       d.Program_Type__c,
       d.End_User_Type__c,
       d.NFR_Use__c,
       CASE a.SUPPORT_LEVEL__C WHEN 'Enterprise Priority' THEN 'PLAT E' WHEN 'Advanced Support' THEN 'GOLDA' WHEN 'Basic Support' THEN 'SILVER' WHEN 'Bronze' THEN 'BRONZE' ELSE nullif(d.subscription_Level__c,'') END as supportLevel,
                   concat(nullif(d.product_line_code__c,''),nullif(d.Usage_Type__c,''),nullif(d.Program_Type__c,''),CASE a.SUPPORT_LEVEL__C WHEN 'Enterprise Priority' THEN 'PLAT E' WHEN 'Advanced Support' THEN 'GOLDA' WHEN 'Basic Support' THEN 'SILVER' WHEN 'Bronze' THEN 'BRONZE' ELSE nullif(d.subscription_Level__c,'') END,nullif(d.End_User_Type__c, ''),nullif(d.NFR_Use__c,'')) as Maintenance_Renewal_SKU_Key__c,
                   a.ACE_DISCOUNT_ELIGIBLE__C,
       a.SUPPORT_LEVEL__C as OLI_Support_Level,
       d.subscription_Level__c as subscription_SKU_Support_Level,
       p.Part_Number__c as Renewal_SKU,
       p.name as Description,
       p.Material_Group__c,
       p.Sales_License_Type_Code__c,
       p.SPECIAL_SALES_PROGRAM_TYPE__C,
       sfa.ASSET_NUMBER__C
from salesforce.OPPORTUNITYLINEITEM a
left outer join salesforce.OPPORTUNITY o ON o.sfid = a.Opportunityid
left outer join salesforce.CONTRACTLINEITEM b on a.contract_line_item__C = b.sfid
left outer join salesforce.SERVICECONTRACT  s on (s.sfid = b.SERVICECONTRACTID)
left outer join salesforce.PRODUCT2 d on d.sfid = b.Product_SKU__c
left outer join salesforce.PRODUCT2 p on (p.Maintenance_Renewal_SKU_Key__c = concat(nullif(d.product_line_code__c,''),nullif(d.Usage_Type__c,''),nullif(d.Program_Type__c,''),CASE a.SUPPORT_LEVEL__C WHEN 'Enterprise Priority' THEN 'PLAT E' WHEN 'Advanced Support' THEN 'GOLDA' WHEN 'Basic Support' THEN 'SILVER' WHEN 'Bronze' THEN 'BRONZE' ELSE nullif(d.subscription_Level__c,'') END,nullif(d.End_User_Type__c, ''),nullif(d.NFR_Use__c,''))
                                            and (p.Billing_Behavior_code__c ='' or p.Billing_Behavior_code__c is null)
                                            and p.Material_Group__c = 'SUBSCRPTN'
                                           and p.Service_Type__c = 'AA'
                                            and p.SERVICE_SALES_TYPE__C = 'R'
                                            and (p.SPECIAL_SALES_PROGRAM_TYPE__C ='' or p.SPECIAL_SALES_PROGRAM_TYPE__C is null)
                                            )
left outer join salesforce.RECORDTYPE r on (r.sfid = p.RecordTypeid and r.NAME = 'Product SKU')
left outer join salesforce.RECORDTYPE q on (q.sfid = o.RecordTypeid)
left outer join salesforce.ASSET__C sfa on (sfa.sfid = b.ASSET__c)
where s.BILLING_BEHAVIOR_CODE__C is null
and q.NAME = 'Renewal Opportunity'
and o.opportunity_number__c = $1