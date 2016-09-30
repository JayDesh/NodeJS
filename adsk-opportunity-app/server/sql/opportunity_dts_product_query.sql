select   o.OPPORTUNITY_NUMBER__C,
         c.Part_Number__c as License_SKU,
         d.Part_Number__c as License_SKU_Product,
         a.sfid as LineItemId,
         o.sfid as opptyId,
         s.sfid as agreementId,
         d.Billing_Behavior__c as License_SKU_Product_Billing_Behavior,
         d.Contract_Term__c,
         d.product_line_code__c,
         d.End_User_Type__c,
         d.License_Model__c,
         d.NFR_Use__c,
         d.Deployment__c,
         d.Program_Type__c,
         d.Usage_Type__c,
         CASE a.SUPPORT_LEVEL__C WHEN 'Enterprise Priority' THEN 'PLAT E' WHEN 'Advanced Support' THEN 'GOLDA' WHEN 'Basic Support' THEN 'SILVER' WHEN 'Bronze' THEN 'BRONZE' ELSE nullif(d.subscription_Level__c,'') END as supportLevel,
         concat(nullif(d.Billing_Behavior__c,''),nullif(d.Contract_Term__c,''),nullif(d.product_line_code__c,''),nullif(d.End_User_Type__c, ''),nullif(d.License_Model__c,''),nullif(d.NFR_Use__c,''),nullif(d.Deployment__c,'') ,nullif(d.Program_Type__c,'') ,CASE a.SUPPORT_LEVEL__C WHEN 'Enterprise Priority' THEN 'PLAT E' WHEN 'Advanced Support' THEN 'GOLDA' WHEN 'Basic Support' THEN 'SILVER' WHEN 'Bronze' THEN 'BRONZE' ELSE nullif(d.subscription_Level__c,'') END,nullif(d.Usage_Type__c,'')) as Desktop_Renewal_SKU_Key__c,
         a.ACE_DISCOUNT_ELIGIBLE__C,
         a.SUPPORT_LEVEL__C as OLI_Support_Level,
         d.subscription_Level__c as License_SKU_Support_Level,
         p.Part_Number__c as Renewal_SKU,
         p.name as Description,
         p.Material_Group__c,
         p.Sales_License_Type_Code__c,
         p.SPECIAL_SALES_PROGRAM_TYPE__C,
         c.ASSET_NUMBER__C
from salesforce.OPPORTUNITYLINEITEM a
left outer join salesforce.OPPORTUNITY o ON (o.sfid = a.Opportunityid)
left outer join salesforce.CONTRACTLINEITEM b on (a.contract_line_item__C = b.sfid)
left outer join salesforce.SERVICECONTRACT  s on (s.sfid = b.SERVICECONTRACTID)
left outer join salesforce.ASSET__C c on (b.asset__C = c.sfid)
left outer join salesforce.PRODUCT2 d on (c.part_number__C = d.part_number__C)
left outer join salesforce.PRODUCT2 p on (p.desktop_renewal_sku_key__c = concat(nullif(d.Billing_Behavior__c,''),nullif(d.Contract_Term__c,''),nullif(d.product_line_code__c,''),nullif(d.End_User_Type__c, ''),nullif(d.License_Model__c,''),nullif(d.NFR_Use__c,''),nullif(d.Deployment__c,'') ,nullif(d.Program_Type__c,''),CASE a.SUPPORT_LEVEL__C WHEN 'Enterprise Priority' THEN 'PLAT E' WHEN 'Advanced Support' THEN 'GOLDA' WHEN 'Basic Support' THEN 'SILVER' WHEN 'Bronze' THEN 'BRONZE' ELSE nullif(d.subscription_Level__c,'') END,nullif(d.Usage_Type__c,'')) and p.Sales_License_Type_Code__c = 'TRN'
                                                                  and p.SPECIAL_SALES_PROGRAM_TYPE__C is null)
left outer join salesforce.RECORDTYPE r on (r.sfid = p.RecordTypeid and r.NAME = 'Product SKU')
left outer join salesforce.RECORDTYPE q on (q.sfid = o.RecordTypeid)
where q.NAME = 'Renewal Opportunity'
and o.opportunity_number__c = $1