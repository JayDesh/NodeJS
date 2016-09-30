var opportunitydao = require('../dao/opportunitydao.js'), 
app = require('../../server/server.js').getapp, 
utility = require('../utility/utility.js'), 
fs = require('fs'), 
path = require('path'), 
errorCodes = require('../error/error.js'),
_ = require('underscore');

var outputwrapper=function(status,response,error){
    var ob={
        "status":status||false,
        "response":response||null,
        "error":error || null
    };
    return ob;      
};
var DistributorField = {
  AccountName: 'distributor_name',
  AccountCsn: 'distributor_csn',
  AddressLine1: 'dist_acct_add1',
  AddressLine2: 'dist_acct_add2',
  AddressLine3: 'dist_acct_add3',
  City: 'dist_acct_city',
  Country: 'dist_acct_country',
  State: 'dist_acct_state',
  ZipCode: 'dist_acct_zip_code',
  LanguageCode: 'dist_acct_lang'
};
var EndUserAccountField = {
  AccountName: 'end_user_account_name',
  AccountCsn: 'end_user_acct_csn',
  AddressLine1: 'end_user_acct_add1',
  AddressLine2: 'end_user_acct_add2',
  AddressLine3: 'end_user_acct_add3',
  City: 'end_user_acct_city',
  Country: 'end_user_acct_country',
  State: 'end_user_acct_state',
  ZipCode: 'end_user_acct_zip_code',
  LanguageCode: 'end_user_acct_lang'
};
var SupportingResellerField = {
  AccountName: 'reseller_name',
  AccountCsn: 'reseller_account_csn',
  AddressLine1: 'reseller_acct_add1',
  AddressLine2: 'reseller_acct_add2',
  AddressLine3: 'reseller_acct_add3',
  City: 'reseller_acct_city',
  Country: 'reseller_acct_country',
  State: 'reseller_acct_state',
  ZipCode: 'reseller_acct_zip_code',
  LanguageCode: 'reseller_acct_lang'
};
var EndUserContactField = {
  ContactCSN: 'endusercontactcsn',
  ContactLanguage: 'sfdc_lang',
  EmailAddress: 'contact_email',
  FirstName: 'contact_fname',
  LastName: 'contact_lname',
  AddressLine1: 'contactaddr1',
  AddressLine2: 'contactaddr2',
  AddressLine3: 'contactaddr3',
  ShippingAccountID: 'contact_shippingid',
  City: 'contactcity',
  Country: 'contactcountry',
  CountryOfResidence: 'contactcountry_residence',
  State: 'contactstate',
  ZipCode: 'postalcode',
  Phone: 'phone',
  Fax: 'fax'
};
var EndUserContactAccountField = {
  AccountName: 'contractmgrname',
  AccountCsn: 'contractmgrcsn',
  AddressLine1: 'contractmgrAddr1',
  AddressLine2: 'contractmgrAddr2',
  AddressLine3: 'contractmgrAddr13',
  City: 'contractmgrCity',
  Country: 'cmcountry',
  State: 'cmstate',
  ZipCode: 'cmzipcode',
  LanguageCode: 'cm_lang'
};
var listOfLineItemFields = {
  AssetNumber: 'asset_number__c',
  ItemNumber: 'itemnumber',
  PartNumber: 'part_number__c',
  ProductDescription: 'description',
  ProductLine: 'productcode',
  Quantity: 'quantity__c',
  Seats: 'quantity__c',
  SerialNumber: 'serialnumber__c',
  Status: 'renewal_status__c'
};
var ListOfLineItemEndUserContactField = {
  ContactCSN: 'contact_csn__c',
  ContactLanguage: 'sfdc_lang',
  EmailAddress: 'email',
  FirstName: 'firstname',
  LastName: 'lastname',
  AddressLine1: 'addr_line_1__c',
  AddressLine2: 'street_address_line_2__c',
  AddressLine3: 'street_address_line_3__c',
  ShippingAccountID: 'contact_shippingid',
  City: 'city__c',
  Country: 'country__c',
  CountryOfResidence: 'country_of_residence__c',
  State: 'state__c',
  ZipCode: 'postal_code__c',
  Phone: 'phone',
  Fax: 'fax'
};
var ListOfLineItemEndUserContactAccountField = {
  AccountName: 'null',
  AccountCsn: 'account_csn__c',
  AddressLine1: 'null',
  AddressLine2: 'null',
  AddressLine3: 'null',
  City: 'null',
  Country: 'null',
  State: 'null',
  ZipCode: 'null',
  LanguageCode: 'null'
};

populateAndReturnAccount = function (fields, data) {
  var account = new app.models.Account();
  /*
  var id = utility.getDataValue(data[fields.AccountCsn]); 
  account.$id = id === null ? '' : id;
  var role = utility.getDataValue(data[fields[1]]); 
  account.$role = role === null ? '' : role;
  var languageCode = utility.getDataValue(data[fields[4]]); 
  account.$languageCode = languageCode === null ? '' : languageCode;
  */
  var accountName = utility.getDataValue(data[fields.AccountName]);
  account.$accountName = accountName === null ? '' : accountName;
  var accountCSN = utility.getDataValue(data[fields.AccountCsn]);
  account.$accountCSN = accountCSN === null ? '' : accountCSN;
  return account;
};
populateAndReturnAddress = function (fields, data) {
  var address = new app.models.Address();
  var addressLine1 = utility.getDataValue(data[fields.AddressLine1]);
  address.$addressLine1 = addressLine1 === null ? '' : addressLine1;
  var city = utility.getDataValue(data[fields.City]);
  address.$city = city === null ? '' : city;
  var country = utility.getDataValue(data[fields.Country]);
  address.$country = country === null ? '' : country;
  var postalCode = utility.getDataValue(data[fields.ZipCode]);
  address.$postalCode = postalCode === null ? '' : postalCode;
  var state = utility.getDataValue(data[fields.State]);
  address.$state = state === null ? '' : state;
  var countryOfResidense = utility.getDataValue(data[fields.CountryOfResidence]);
  address.$countryOfResidense = countryOfResidense === null ? '' : countryOfResidense;
  return address;
};
populateAndReturnContact = function (fields, data) {
  var contact = new app.models.Contact();
  var contactCSN = utility.getDataValue(data[fields.ContactCSN]);
  contact.$contactCSN = contactCSN === null ? '' : contactCSN;
  var contactLanguage = utility.getDataValue(data[fields.ContactLanguage]);
  contact.$contactLanguage = contactLanguage === null ? '' : contactLanguage;
  var contactEmail = utility.getDataValue(data[fields.EmailAddress]);
  contact.$contactEmail = contactEmail === null ? '' : contactEmail;
  var firstName = utility.getDataValue(data[fields.FirstName]);
  contact.$firstName = firstName === null ? '' : firstName;
  var lastName = utility.getDataValue(data[fields.LastName]);
  contact.$lastName = lastName === null ? '' : lastName;
  var phoneNumber = utility.getDataValue(data[fields.Phone]);
  contact.$phoneNumber = phoneNumber === null ? '' : phoneNumber;
  var countryOfResidence = utility.getDataValue(data[fields.CountryOfResidence]);
  contact.$countryOfResidence = countryOfResidence === null ? '' : countryOfResidence;
  var city = utility.getDataValue(data[fields.City]);
  contact.$city = city === null ? '' : city;
  var State = utility.getDataValue(data[fields.State]);
  contact.$state = State === null ? '' : State;
  var PostalCode = utility.getDataValue(data[fields.PostalCode]);
  contact.$postalCode = PostalCode === null ? '' : PostalCode;
  var addrline1 = utility.getDataValue(data[fields.ContactAddrLn1]);
  //var addrline1 = utility.getDataValue(data[contactaddr1]);  
  contact.$addrLine1 = addrline1 === null ? '' : addrline1;
  var shippingAccountId=utility.getDataValue(data[fields.ShippingAccountID]);
  contact.$shippingAccountId = shippingAccountId === null ? '' : shippingAccountId; 
  return contact;
};
populateAndReturnAgreement = function (data) {
  var agreement = new app.models.Agreement();
  
  var AgreementId = utility.getDataValue(data.agreement_num);
  agreement.$AgreementId = AgreementId === null ? '' : AgreementId;
  
  var assetEndDate = utility.getISODate(data.asset_end_date__c);
  agreement.$assetEndDate = assetEndDate === null ? '' : assetEndDate;
  //var agreementEndDate=utility.getISODate(data.enddate);
  var agreementExpirationDate = utility.getISODate(data.enddate);
  agreement.$ExpirationDate = agreementExpirationDate === null ? '' : agreementExpirationDate;
  
  /*
  if(utility.getISODate(data.asset_end_date__c)!==utility.getISODate(data.enddate))
  {
  var ExpirationDate = utility.getISODate(data.asset_end_date__c);
  agreement.$ExpirationDate = ExpirationDate === null ? '' : ExpirationDate;
  }else{
    var ExpirationDate = utility.getISODate(data.enddate);
    agreement.$ExpirationDate = ExpirationDate === null ? '' : ExpirationDate;
  }
  */
  
  var RenewalTerm = utility.getDataValue(data.contractterm);
  agreement.$RenewalTerm = RenewalTerm === null ? '' : RenewalTerm;  
  var StartDate = utility.getISODate(data.agreement_st_date);
  agreement.$StartDate = StartDate === null ? '' : StartDate;  
  var Status = utility.getDataValue(data.status);
  agreement.$Status = Status === null ? '' : Status;  
  var futureAgreementEndDate = null;
  //Future agreement end date start
  var renewalTerm = null;
  if (data.renewal_term != null) {
    if ((data.renewal_term == 1 || data.renewal_term == 2) && data.uom != 'Month') {
      renewalTerm = data.renewal_term * 12;
    } else if (data.renewal_term == 3 && _.isEmpty(data.billingbehaviourcode) && data.uom != 'Month') {
      renewalTerm = data.renewal_term * 12;
    } else {
      renewalTerm = data.renewal_term;
    }
    futureAgreementEndDate = utility.getISODate(utility.addMonths(agreement.$assetEndDate, renewalTerm));
  }
  agreement.$FutureEndDate = futureAgreementEndDate === null ? '' : futureAgreementEndDate;
  //Future agreement end date ends  
  return agreement;
};
populateAndReturnOpportunity = function (data) {
  var opportunityResponse = {
    OpportunityId: '',
    RenewalTerm: '',
    RequestRenewalFlag: '',
    PONumber: '',
    DealerPONumber: '',
    Status: '',
    Type: '',
    Renewal_Term_UOM: '',
    ContractTerm :'',
    BillingBehaviour :'',
    Agreement: {
      AgreementId: '',
      AgreementExpirationDate: '',
      FutureEndDate: '',
      RenewalTerm: '',
      StartDate: '',
      Status: '',
      assetEndDate: ''
    },
    Distibutor: {
      AccountCSN: '',
      AccountName: '',
      Address: {
        addressLine1: '',
        city: '',
        country: '',
        postalCode: '',
        state: ''
      }
    },
    EndUser: {
      EnduserAccount: {
        AccountCSN: '',
        AccountName: '',
        Address: {
          addressLine1: '',
          city: '',
          country: '',
          postalCode: '',
          state: ''
        }
      },
      EndUserContact: {
        ContactCSN: '',
        ContactLanguage: '',
        EmailAddress: '',
        FirstName: '',
        LastName: '',
        ListOfAddress: [{ Address: {addressLine1:'', city:'', statecode:'', countrycode: '', postalcode:''} }],
        ListOfAccountCSN: [{ Account: { AccountCSN: '' } }],
        ListOfPhone: [{ Phone: { PhoneNumber: '' } }]
      }
    },
    ListOfLineItem: '',
    SupportingReseller: {
      AccountCSN: '',
      AccountName: '',
      Address: {
        addressLine1: '',
        city: '',
        country: '',
        postalCode: '',
        state: ''
      }
    }
  };
  var opportunity = new app.models.Opportunity();
  //Opportunity Start
  var OpportunityId = utility.getDataValue(data.opportunity_number__c);
  opportunity.$OpportunityId = OpportunityId === null ? '' : OpportunityId;
  var Renewal_Term_UOM = utility.getDataValue(data.uom);
  opportunity.$Renewal_Term_UOM = Renewal_Term_UOM === null ? '' : Renewal_Term_UOM;
  var RenewalTermC = utility.getDataValue(data.renewal_term);  
  if (opportunity.$Renewal_Term_UOM === 'Year' || opportunity.$Renewal_Term_UOM === '') {
    var temp = RenewalTermC / 12;
    
    if (temp >= 1) {
      opportunity.$RenewalTerm = temp === null ? '' : temp;      
    } else {
      opportunity.$RenewalTerm = RenewalTermC === null ? '' : RenewalTermC;
    }
    opportunity.$Renewal_Term_UOM = 'Year';
  } else {
    opportunity.$RenewalTerm = RenewalTermC === null ? '' : RenewalTermC;
  }
  var RequestRenewalFlag = data.onlinerenewalflag;
  opportunity.$RequestRenewalFlag = RequestRenewalFlag === null ? '' : RequestRenewalFlag;
  var PONumber = utility.getDataValue(data.ponumber);
  opportunity.$PONumber = PONumber === null ? '' : PONumber;
  var DealerPONumber = utility.getDataValue(data.dealerpo);
  opportunity.$DealerPONumber = DealerPONumber === null ? '' : DealerPONumber;
  var StatusDB = utility.getDataValue(data.renewal_status__c);  
  var Status= 'Open';
  opportunity.$Status = Status === null ? '' : Status;
  var Type = function () {
    var RecordTypeName = utility.getDataValue(data.name);   
    if (RecordTypeName == 'Renewal Opportunity') {
      return 'Renewal';
    } else {
      return 'Non-Renewal';
    }
  };
  opportunity.$Type = Type() === null ? '' : Type();
  opportunityResponse.OpportunityId = OpportunityId;
  opportunityResponse.RenewalTerm = opportunity.$RenewalTerm;
  opportunityResponse.RequestRenewalFlag = opportunity.$RequestRenewalFlag;
  opportunityResponse.PONumber = PONumber;
  opportunityResponse.DealerPONumber = DealerPONumber;
  opportunityResponse.Status = opportunity.$Status;
  opportunityResponse.Type = opportunity.$Type;
  opportunityResponse.Renewal_Term_UOM = opportunity.$Renewal_Term_UOM;
  opportunityResponse.ContractTerm=data.contractterm;
  opportunityResponse.BillingBehaviour=data.billingbehaviourcode;
  //Opportunity end
  //Agreement Section Start
  var agreement = populateAndReturnAgreement(data);
  opportunityResponse.Agreement.AgreementId = agreement.AgreementId;
  opportunityResponse.Agreement.AgreementExpirationDate = agreement.ExpirationDate;
  opportunityResponse.Agreement.FutureEndDate = agreement.FutureEndDate;
  opportunityResponse.Agreement.RenewalTerm = opportunity.$RenewalTerm;
  //Same as opportunity renewal term
  opportunityResponse.Agreement.StartDate = agreement.StartDate;
  opportunityResponse.Agreement.Status = agreement.Status;
  opportunityResponse.Agreement.assetEndDate = agreement.assetEndDate;
  //Agreement Section Ends
  //Distributor start
  var distributorAccount = populateAndReturnAccount(DistributorField, data);
  var distributorAddress = populateAndReturnAddress(DistributorField, data);
  opportunityResponse.Distibutor.AccountCSN = distributorAccount.accountCSN;
  opportunityResponse.Distibutor.AccountName = distributorAccount.accountName;
  opportunityResponse.Distibutor.Address.addressLine1 = distributorAddress.addressLine1;
  opportunityResponse.Distibutor.Address.city = distributorAddress.city;
  opportunityResponse.Distibutor.Address.country = distributorAddress.country;
  opportunityResponse.Distibutor.Address.postalCode = distributorAddress.postalCode;
  opportunityResponse.Distibutor.Address.state = distributorAddress.state;
  //Distributor end
  //EndUser start
  var EndUserAccount = populateAndReturnAccount(EndUserAccountField, data);
  var EndUserAccountAddress = populateAndReturnAddress(EndUserAccountField, data);
  opportunityResponse.EndUser.EnduserAccount.AccountCSN = EndUserAccount.accountCSN;
  opportunityResponse.EndUser.EnduserAccount.AccountName = EndUserAccount.accountName;
  opportunityResponse.EndUser.EnduserAccount.Address.addressLine1 = EndUserAccountAddress.addressLine1;
  opportunityResponse.EndUser.EnduserAccount.Address.city = EndUserAccountAddress.city;
  opportunityResponse.EndUser.EnduserAccount.Address.country = EndUserAccountAddress.country;
  opportunityResponse.EndUser.EnduserAccount.Address.postalCode = EndUserAccountAddress.postalCode;
  opportunityResponse.EndUser.EnduserAccount.Address.state = EndUserAccountAddress.state;
  //EndUser End
  //EndUserContact Start
  var EndUserContact = populateAndReturnContact(EndUserContactField, data);
  var EndUserContactAddress = populateAndReturnAddress(EndUserContactField, data);  
  var EndUserContactAccount = populateAndReturnAccount(EndUserContactAccountField, data);
  opportunityResponse.EndUser.EndUserContact.ContactCSN = EndUserContact.contactCSN;
  opportunityResponse.EndUser.EndUserContact.ContactLanguage = EndUserContact.contactLanguage;
  opportunityResponse.EndUser.EndUserContact.EmailAddress = EndUserContact.contactEmail;
  opportunityResponse.EndUser.EndUserContact.FirstName = EndUserContact.firstName;
  opportunityResponse.EndUser.EndUserContact.LastName = EndUserContact.lastName;
  opportunityResponse.EndUser.EndUserContact.ListOfAddress[0].Address.addressLine1  = EndUserContactAddress.addressLine1;
  opportunityResponse.EndUser.EndUserContact.ListOfAddress[0].Address.city  = EndUserContactAddress.city;
  opportunityResponse.EndUser.EndUserContact.ListOfAddress[0].Address.statecode  = EndUserContactAddress.state;
  opportunityResponse.EndUser.EndUserContact.ListOfAddress[0].Address.countrycode  = EndUserContactAddress.countryOfResidense;
  opportunityResponse.EndUser.EndUserContact.ListOfAddress[0].Address.postalcode  = EndUserContactAddress.postalCode;  
  if(EndUserContact.shippingAccountId!=''){    
    opportunityResponse.EndUser.EndUserContact.ListOfAccountCSN[0].Account.AccountCSN = EndUserContact.shippingAccountId;
  }else{
    opportunityResponse.EndUser.EndUserContact.ListOfAccountCSN[0].Account.AccountCSN = EndUserContactAccount.accountCSN;
  }  
  opportunityResponse.EndUser.EndUserContact.ListOfPhone[0].Phone.PhoneNumber = EndUserContact.phoneNumber;
  
  //EndUserContact End
  //Supporting Reseller start
  var supportingResellerAccount = populateAndReturnAccount(SupportingResellerField, data);
  var supportingResellerAddress = populateAndReturnAddress(SupportingResellerField, data);
  opportunityResponse.SupportingReseller.AccountCSN = supportingResellerAccount.accountCSN;
  opportunityResponse.SupportingReseller.AccountName = supportingResellerAccount.accountName;
  opportunityResponse.SupportingReseller.Address.addressLine1 = supportingResellerAddress.addressLine1;
  opportunityResponse.SupportingReseller.Address.city = supportingResellerAddress.city;
  opportunityResponse.SupportingReseller.Address.country = supportingResellerAddress.country;
  opportunityResponse.SupportingReseller.Address.postalCode = supportingResellerAddress.postalCode;
  opportunityResponse.SupportingReseller.Address.state = supportingResellerAddress.state;
  //Supporting Reseller end 
  return opportunityResponse;
};
/*
 * populateAndReturnOpportunityLineItem
 * @params opportunityLineItemData from db*
 * 
 *
 */
populateAndReturnOpportunityLineItem = function (fields, data) {
  var opportunityLineItemResponse = {
    AssetNumber: '',
    ItemNumber: '',
    PartNumber: '',
    ProductDescription: '',
    ProductLine: '',
    Quantity: '',
    Seats: '',
    SerialNumber: '',
    Status: '',
    EndUser: {
      EndUserContact: {
        ContactCSN: '',
        ContactLanguage: '',
        EmailAddress: '',
        FirstName: '',
        LastName: '',
        ListOfAddress: [{ Address: { addressLine1:'', city:'', statecode:'', countrycode: '', postalcode:'' } }],
        ListOfAccountCSN: [{ Account: { AccountCSN: '' } }],
        ListOfPhone: [{ Phone: { PhoneNumber: '' } }]
      }
    }
  };
  var oli = new app.models.OpportunityLineItem();
  if (data !== undefined) {
    var AssetNumber = utility.getDataValue(data[fields.AssetNumber]);
    oli.$assetNumber = AssetNumber === null ? '' : AssetNumber;
    var ItemNumber = utility.getDataValue(data[fields.ItemNumber]).slice(0,-3).slice(3);
    oli.$itemNumber = ItemNumber === null ? '' : ItemNumber;
    var PartNumber = utility.getDataValue(data[fields.PartNumber]);
    oli.$partNumber = PartNumber === null ? '' : PartNumber;    
    var ProductDescription = utility.getDataValue(data[fields.ProductDescription]);
    oli.$productDescription = ProductDescription === null ? '' : ProductDescription;
    var ProductCode = utility.getDataValue(data[fields.ProductLine]);
    oli.$productCode = ProductCode === null ? '' : ProductCode;
    var Quantity = utility.getDataValue(data[fields.Quantity]);
    oli.$quantity = Quantity === null ? '' : Quantity;
    var Seats = utility.getDataValue(data[fields.Seats]);
    oli.$seats = Seats === null ? '' : Seats;
    var SerialNumber = utility.getDataValue(data[fields.SerialNumber]);
    oli.$serialNumber = SerialNumber === null ? '' : SerialNumber;
    var Status = utility.getDataValue(data[fields.Status]);
    oli.$status = Status === null ? '' : Status;
    opportunityLineItemResponse.AssetNumber = AssetNumber;
    opportunityLineItemResponse.ItemNumber = ItemNumber;
    opportunityLineItemResponse.PartNumber = PartNumber;
    opportunityLineItemResponse.ProductDescription = ProductDescription;
    opportunityLineItemResponse.ProductLine = ProductCode;
    opportunityLineItemResponse.Quantity = Quantity;
    opportunityLineItemResponse.Seats = Seats;
    opportunityLineItemResponse.SerialNumber = SerialNumber;
    opportunityLineItemResponse.Status = Status;
    //EndUserContact Start
    var EndUserContact = populateAndReturnContact(ListOfLineItemEndUserContactField, data);
    var EndUserContactAddress=populateAndReturnAddress(ListOfLineItemEndUserContactField,data);
    var EndUserContactAccount = populateAndReturnAccount(ListOfLineItemEndUserContactAccountField, data);     
    opportunityLineItemResponse.EndUser.EndUserContact.ContactCSN = EndUserContact.contactCSN;
    opportunityLineItemResponse.EndUser.EndUserContact.ContactLanguage = EndUserContact.contactLanguage;
    opportunityLineItemResponse.EndUser.EndUserContact.EmailAddress = EndUserContact.contactEmail;
    opportunityLineItemResponse.EndUser.EndUserContact.FirstName = EndUserContact.firstName;
    opportunityLineItemResponse.EndUser.EndUserContact.LastName = EndUserContact.lastName;
    opportunityLineItemResponse.EndUser.EndUserContact.ListOfAddress[0].Address.addressLine1  = EndUserContactAddress.addressLine1;
    opportunityLineItemResponse.EndUser.EndUserContact.ListOfAddress[0].Address.city  = EndUserContactAddress.city;
    opportunityLineItemResponse.EndUser.EndUserContact.ListOfAddress[0].Address.statecode  = EndUserContactAddress.state;
    opportunityLineItemResponse.EndUser.EndUserContact.ListOfAddress[0].Address.countrycode  = EndUserContactAddress.countryOfResidense;
    opportunityLineItemResponse.EndUser.EndUserContact.ListOfAddress[0].Address.postalcode  = EndUserContactAddress.postalCode;


  //if(EndUserContact.shippingAccountId!=''){
    //console.log("LineItem Shipping ID >>>"+EndUserContact.shippingAccountId);
    //opportunityLineItemResponse.EndUser.EndUserContact.ListOfAccountCSN[0].Account.AccountCSN = EndUserContact.shippingAccountId;
  //}else{
    opportunityLineItemResponse.EndUser.EndUserContact.ListOfAccountCSN[0].Account.AccountCSN = EndUserContactAccount.accountCSN;
   //}
    opportunityLineItemResponse.EndUser.EndUserContact.ListOfPhone[0].Phone.PhoneNumber = EndUserContact.phoneNumber;
    //EndUserContact End      
    return opportunityLineItemResponse;
  }
};
  

module.exports = {
  populateAndReturnOpportunity:populateAndReturnOpportunity,
  populateAndReturnOpportunityLineItem:populateAndReturnOpportunityLineItem,
  listOfLineItemFields:listOfLineItemFields,
  outputwrapper:outputwrapper
  
  
};
