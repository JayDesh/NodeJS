select distinct
      efinish_efile_view.efgpartnumber,
      efinish_efile_view.prodefgproductlinecode,
      efinish_efile_view.prodefgversion,
      efinish_efile_view.efgdownloadenddate,
      efinish_efile_view.efilepartnumber,
      efinish_efile_view.efileproductlinecode,
      efinish_efile_view.efileversion,
      efinish_efile_view.efilelanguages,
      efinish_efile_view.efilesubrelease,
      efinish_efile_view.efiledescription,
      efinish_efile_view.efileprimaryproductline,
      efinish_efile_view.efilechecksum,
      efinish_efile_view.efilenamewithpath,
      efinish_efile_view.efilepackedfilesize,
      efinish_efile_view.efileunpackedfilesize,
      efinish_efile_view.efilecontenttype,
      efinish_efile_view.efiledownloadmethod,
      efinish_efile_view.efilepateform
    from
    salesforce.efinish_efile_view efinish_efile_view
    where
    efinish_efile_view.efgdownloadenddate > CURRENT_TIMESTAMP
    and efinish_efile_view.prodefgplcv in
