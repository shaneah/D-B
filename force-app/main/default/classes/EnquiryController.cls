/**
* Class EnquiryController to get the Enquiries of Ingenious
* 
* 
* Created by : Yogesh
* Last Modified : 
*/
public  without sharing  class EnquiryController {
    
    /**
* get Ingenious Enquiries
* 
*/ 
    public List<PBA__REQUEST__c> getEnquiries() {
        
        return [SELECT  Id , Name, pba__Contact__c,
                pba__Contact__r.name, ContactPhoneNumber__c , Contact_Mobile_Number__c, 
                pba__Contact__r.email,
                createdDate,
                pba__Status__c , 
                Project__c, 
                pba__Comments__c, 
                agency__C
                //Whatsapp_Call__c                    
                FROM pba__Request__c where agency__C like '%Ingenious%' Order by createdDate desc  Limit 1000 ];
        
    }
    
    /**
* get "Property Guru" Enquiries
* 
* 
*/
    public List<PBA__REQUEST__c> getPropertyGuruEnquiries() {
        
        return [SELECT Id ,Name, pba__Contact__c,
                pba__Contact__r.name, ContactPhoneNumber__c , Contact_Mobile_Number__c, 
                pba__Contact__r.email,
                createdDate,
                pba__Status__c , 
                Project__c, 
                pba__Comments__c, 
                agency__C
               // Whatsapp_Call__c
                FROM pba__Request__c where agency__C like '%Property Guru%' Order by createdDate desc  Limit 1000 ];
        
    }
    
    
    /**
* Get a single Enquiry record by ID
* 
* @param recordId Id of the Enquiry record
* @return Single Enquiry record
*/
    @AuraEnabled
    public static pba__Request__c getEnquiryRecordById(Id recordId) {
        return [SELECT Id, Name, pba__Contact__c,
                pba__Contact__r.Name, ContactPhoneNumber__c, Contact_Mobile_Number__c, 
                pba__Contact__r.Email,
                CreatedDate,
                pba__Status__c, 
                Project__c, 
                pba__Comments__c, 
                agency__C
                //Whatsapp_Call__c
                FROM pba__Request__c
                WHERE Id = :recordId];
    }
    
    @AuraEnabled
    public static void updateObject(String recordId, String textAreaValue) {
        // Query the object record using the recordId and update the text area field
        pba__Request__c obj = [SELECT Id, EOI_Collection__c FROM pba__Request__c WHERE Id = :recordId LIMIT 1];
        obj.EOI_Collection__c = textAreaValue;
        update obj;
    }
    
    
    @AuraEnabled
    public static void updateEnquiryPicklist(Id recordId, String picklistValue) {
        pba__Request__c enquiry = [SELECT Id FROM pba__Request__c WHERE Id = :recordId LIMIT 1];
        if (enquiry != null) {
           // enquiry.Whatsapp_Call__c = picklistValue;
            update enquiry;
        }
    }
    @AuraEnabled
    public static Map<String, List<String>> getPicklistFieldOptions() {
        Map<String, List<String>> picklistOptions = new Map<String, List<String>>();
        Schema.DescribeSObjectResult describeResult = pba__Request__c.SObjectType.getDescribe();
        Map<String, Schema.SObjectField> fields = describeResult.fields.getMap();
        
        for (String fieldName : fields.keySet()) {
            Schema.SObjectField field = fields.get(fieldName);
            Schema.DescribeFieldResult fieldResult = field.getDescribe();
            if (fieldResult.isAccessible() && fieldResult.getType() == Schema.DisplayType.Picklist) {
                List<String> picklistLabels = new List<String>();
                
                for (Schema.PicklistEntry picklistValue : fieldResult.getPicklistValues()) {
                    picklistLabels.add(picklistValue.getLabel());
                }
                
                picklistOptions.put(fieldName, picklistLabels);
            }
        }
        
        return picklistOptions;
    }
    
    
    
    //@AuraEnabled
   // public static List<String> getPicklistValuesForWhatsappCall() {
      //  List<String> picklistValues = new List<String>();
      //  Schema.DescribeFieldResult fieldResult = pba__Request__c.Whatsapp_Call__c.getDescribe();
        
        //for (Schema.PicklistEntry picklistValue : fieldResult.getPicklistValues()) {
         //   picklistValues.add(picklistValue.getValue());
        //}
        
       // return picklistValues;
    //}
    //@AuraEnabled
    //public static void updateEnquiryPicklistField(Id recordId, String picklistValue) {
        //PBA__REQUEST__c enquiryRecord = [SELECT Id, Whatsapp_Call__c FROM PBA__REQUEST__c WHERE Id = :recordId LIMIT 1];
        //enquiryRecord.Whatsapp_Call__c = picklistValue;
        //update enquiryRecord;
   // }
    
    //@AuraEnabled
    //public static String fetchEnquiryPicklistValue(Id recordId) {
       // PBA__REQUEST__c enquiryRecord = [SELECT Id FROM PBA__REQUEST__c WHERE Id = :recordId LIMIT 1];
        //return enquiryRecord.Whatsapp_Call__c;
    //}
    
    @AuraEnabled
    public static String fetchArchivalReason(Id recordId) {
        List<PBA__REQUEST__c> enquiryRecord = [SELECT Id, Archived_Reason__c FROM PBA__REQUEST__c WHERE Id = :recordId LIMIT 1];
        return enquiryRecord.size() > 0 ? enquiryRecord[0].Archived_Reason__c : null;
    }
    
	@AuraEnabled
    public static String fetchEnquiryStatusPicklistValue(Id recordId) {
        PBA__REQUEST__c enquiryRecord = [SELECT Id, Enquiry_Status__c,No_of_Attempts__c  FROM PBA__REQUEST__c WHERE Id = :recordId LIMIT 1];
        return enquiryRecord.Enquiry_Status__c+'#'+enquiryRecord.No_of_Attempts__c;
    }    

    public static void followUp1Comment(String recordId,String f1Comment){

        //pba__Request__c obj = [SELECT Id, FollowUp_1_Comment__c FROM pba__Request__c WHERE Id = :recordId LIMIT 1];
        //obj.FollowUp_1_Comment__c = f1Comment;
        //update obj;
        pba__Request__c obj = new pba__Request__c();
        obj.FollowUp_1_Comment__c = f1Comment;
        insert obj;
    }
    public static void followUp2Comment(String f2Comment){
        pba__Request__c obj = new pba__Request__c();
        obj.FollowUp_2_Comment__c = f2Comment;
        insert obj;
    }
    public static void followUp3Comment(String f3Comment){
        pba__Request__c obj = new pba__Request__c();
        obj.FollowUp_3_Comment__c = f3Comment;
        insert obj;
    }



















    @AuraEnabled
    public static List<String> getPicklistValuesForField(String objectName, String fieldName) {
        List<String> picklistValues = new List<String>();
        
        String fieldApiName = objectName + '.' + fieldName;
        Schema.DescribeFieldResult fieldResult = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap().get(fieldName).getDescribe();
        
        if (fieldResult.getType() == Schema.DisplayType.Picklist) {
            for (Schema.PicklistEntry picklistValue : fieldResult.getPicklistValues()) {
                picklistValues.add(picklistValue.getValue());
            }
        }
        System.debug('picklistValues'+picklistValues);
        return picklistValues;
    }
    
    @AuraEnabled
    public static void updatePicklistField(String objectName, Id recordId, String fieldName, String picklistValue) {
        String fieldApiName = objectName + '.' + fieldName;
        SObject record = Schema.getGlobalDescribe().get(objectName).newSObject(recordId);
        System.debug('record--------'+record);
        System.debug('picklistValue--------'+picklistValue);
        System.debug('fieldName--------'+fieldName);
        if (record != null && record.getSObjectType().getDescribe().fields.getMap().containsKey(fieldName)) {
            record.put(fieldName, picklistValue);
            update record;
        }
    }
    @AuraEnabled
    public static String fetchPicklistFieldValue(String objectName, Id recordId, String fieldName) {
        String fieldApiName = objectName + '.' + fieldName;
        SObject record = Schema.getGlobalDescribe().get(objectName).newSObject(recordId);
        
        if (record != null && record.getSObjectType().getDescribe().fields.getMap().containsKey(fieldName)) {
            return (String) record.get(fieldName);
        }
        
        return null;
    }
    
    
    
    
    @AuraEnabled
    public static String getRecordTypeId(Id recordId) {
        // Retrieve the record type Id based on the recordId
        String recordTypeId = [SELECT RecordTypeId FROM PBA__REQUEST__c WHERE Id = :recordId LIMIT 1].RecordTypeId;
        System.debug('recordTypeId'+recordTypeId);
        return recordTypeId;
    }
    @AuraEnabled
    public static List<String> getPicklistValuesForFieldAndRecordType(String objectName, String fieldName, String recordTypeId) {
        List<String> picklistValues = new List<String>();
        
        // Determine the API name of the field you want to query (e.g., 'pba__Status__c')
        String fieldApiName = objectName + '.' + fieldName;
        
        // Query the picklist values based on the specified field API name and record type Id
        String query = 'SELECT ' + fieldApiName + ' FROM ' + objectName + ' WHERE RecordTypeId = :recordTypeId';
        System.debug('query'+query);
        
        List<SObject> records = Database.query(query);
        
        // Loop through the records to gather picklist values
        for (SObject record : records) {
            picklistValues.add((String) record.get(fieldName));
        }
        System.debug('picklistValues'+picklistValues);
        
        return picklistValues;
    }
    
    @AuraEnabled
    public static Map<String, List<String>> getPicklistFieldsForStatus(String recordTypeId) {
        Map<String, List<String>> statusToFieldsMapping = new Map<String, List<String>>();
        
        // Customize this mapping based on your requirements
        statusToFieldsMapping.put('No Answer', new List<String>{'Whatsapp_Call__c'});
        statusToFieldsMapping.put('Contact Made', new List<String>{'Contactable__c' });
        statusToFieldsMapping.put('WHATSAPP SENT', new List<String>{'Contactable__c' });
        statusToFieldsMapping.put('Call Again', new List<String>{'Contactable__c' });
        statusToFieldsMapping.put('EMAIL SENT', new List<String>{'Contactable__c' });
        
        // Add more mappings here
        System.debug('statusToFieldsMapping'+statusToFieldsMapping);
        return statusToFieldsMapping;
    }
    
    @AuraEnabled
    public static List<String> getPicklistValuesForContactable( String tabSelected ) {
        List<String> picklistValues = new List<String>();
        Schema.DescribeFieldResult fieldResult;
        SYSTEM.debug('++++ tabSelected= '+ tabSelected);
        if(tabSelected == 'Contact Made'){
            SYSTEM.debug('++++ tabSelected= '+ tabSelected);
            //fieldResult = pba__Request__c.Contactable__c.getDescribe();
        }else if(tabSelected == 'Qualification'){
            SYSTEM.debug('++++ tabSelected= '+ tabSelected);
            fieldResult = pba__Request__c.Qualification_Status__c.getDescribe();
            SYSTEM.debug('++++ fieldResult= '+ fieldResult);
        }else if(tabSelected =='Lead Status'){
            System.debug('tabSelected in Status -------'+tabSelected);
            fieldResult=pba__Request__c.Lead_Status__c.getDescribe();
        }else if(tabSelected =='Attempt 1'){
            System.debug('tabSelected in Status -------'+tabSelected);
            fieldResult=pba__Request__c.ATTEMPT_1__c.getDescribe();
        }else if(tabSelected =='Attempt 2'){
            System.debug('tabSelected in Status -------'+tabSelected);
            fieldResult=pba__Request__c.ATTEMPT_2__c.getDescribe();
        }else if(tabSelected =='Attempt 3'){
            System.debug('tabSelected in Status -------'+tabSelected);
            fieldResult=pba__Request__c.ATTEMPT_3__c.getDescribe();
        }else if(tabSelected =='Qualified'){
            System.debug('tabSelected in Qualification -------'+tabSelected);
            fieldResult=pba__Request__c.Qualified__c.getDescribe();
        }
        
        else if(tabSelected =='Unqualified'){
            System.debug('tabSelected in Qualification -------'+tabSelected);
            fieldResult=pba__Request__c.Unqualified_Status__c.getDescribe();
        }
        else if(tabSelected =='Meeting scheduled'){
            System.debug('tabSelected in Qualification -------'+tabSelected);
            fieldResult=pba__Request__c.Meeting_scheduled_Status__c.getDescribe();
        }
        else if(tabSelected =='Meeting Outcome'){
            System.debug('tabSelected in Qualification -------'+tabSelected);
            fieldResult=pba__Request__c.Meeting_Outcome__c.getDescribe();
        }
        else if(tabSelected =='Follow Up 1'){
            System.debug('tabSelected in Qualification -------'+tabSelected);
            fieldResult=pba__Request__c.Follow_Up_1__c.getDescribe();
        }
        else if(tabSelected =='Follow Up 2'){
            System.debug('tabSelected in Qualification -------'+tabSelected);
            fieldResult=pba__Request__c.Follow_Up_2__c.getDescribe();
        }
        else if(tabSelected =='Follow Up 3'){
            System.debug('tabSelected in Qualification -------'+tabSelected);
            fieldResult=pba__Request__c.Follow_Up_3__c.getDescribe();
        }
        //else if(tabSelected =='EOI Collection'){
          //  System.debug('tabSelected in Qualification -------'+tabSelected);
           // fieldResult=pba__Request__c.EOI_Collection__c.getDescribe();
       // }
        
        
        
        for (Schema.PicklistEntry picklistValue : fieldResult.getPicklistValues()) {
            picklistValues.add(picklistValue.getValue());
            
        }     
        
        return picklistValues;
    }
    @AuraEnabled
    public static String getCurrentPicklistValue(String recordId, String fieldName) {
        String currentValue = null;
        
        // Query the record to get the current picklist value
        String query = 'SELECT ' + fieldName + ' FROM pba__Request__c WHERE Id = :recordId LIMIT 1';
        
        try {
            SObject record = Database.query(query);
            if (record != null) {
                currentValue = (String) record.get(fieldName);
            }
        } catch (Exception e) {
            System.debug('Error fetching current picklist value: ' + e.getMessage());
        }
        System.debug('currentValue'+currentValue);
        return currentValue;
    }
    @AuraEnabled
    public static void updateData(String untouchedParam, String contactMadeParam , string RecordId) {
        pba__Request__c  rr = [select id, Untouched__c from pba__Request__c where id =:RecordId ] ;
        //rr.Contactable__c =contactMadeParam;
        rr.Untouched__c =untouchedParam;
        update rr;
    }
    @AuraEnabled
    public static void updateAttempts(Integer noOfAttempts, string currentStatus, string RecordId) {
        List<pba__Request__c>  enquiryList = [select id, Enquiry_Status__c  ,  No_of_Attempts__c from pba__Request__c where id =:RecordId ] ;
        if(enquiryList.size() > 0){
            if(noOfAttempts != 0){
                enquiryList[0].No_of_Attempts__c = noOfAttempts;
                
            }
            enquiryList[0].Enquiry_Status__c  = currentStatus;
            update enquiryList[0];
            
        }
    }
}