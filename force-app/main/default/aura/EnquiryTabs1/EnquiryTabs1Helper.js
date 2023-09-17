({
    fetchPicklistValues: function(component, fieldName) {
        var recordTypeId = component.get("v.enquiryRecord.RecordTypeId");
        var action = component.get("c.getPicklistValuesForFieldAndRecordType");
        action.setParams({
            "objectName": "PBA__REQUEST__c",
            "fieldName": fieldName,
            "recordTypeId": recordTypeId
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.picklistOptions", response.getReturnValue());
                this.setDefaultPicklistValue(component);
            } else {
                console.error("Error fetching picklist values: " + response.getError());
            }
        });
        
        $A.enqueueAction(action);
    },
    
    setDefaultPicklistValue: function(component) {
        var selectedTabLabel = component.get("v.selectedTabLabel");
        var picklistOptions = component.get("v.picklistOptions");
        if (selectedTabLabel && picklistOptions.length > 0) {
            var defaultPicklistValue = picklistOptions[0]; // You can modify this logic
            component.set("v.picklistValue", defaultPicklistValue);
        }
    },
    
    
    
    
    updatePicklistField: function(component, fieldName, selectedValue, callback) {
        var recordId = component.get("v.recordId");
        var action = component.get("c.updatePicklistField");
        action.setParams({
            "objectName": "PBA__REQUEST__c",
            "recordId": recordId,
            "fieldName": fieldName,
            "picklistValue": selectedValue
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                callback("SUCCESS");
            } else {
                callback("ERROR");
            }
        });
        
        $A.enqueueAction(action);
    },
    
    getTabValue: function(selectedValue,selectedTabLabel1) {
        
        console.log('inside gettabvalue');
        console.log('tab value ->',selectedTabLabel1);
        //var eoiCollection = component.get('v.EOI Collection');
        //console.log('Eoi Collection',eoiCollection);
        // Define the mapping of picklist values to corresponding return values
        if (selectedValue == 'Attempt 1') {
            return 'Attempt 1';
        } else if(selectedValue == 'No Answer'){
            return 'Attempt 2';
        }else if(selectedValue == 'Call Again'){
            return 'Attempt 2';
        }else if(selectedValue == 'Whatsapp Sent'){
            return 'Attempt 3';
        }else if(selectedValue == 'Connected'){
            return 'Qualification';
        }else if(selectedValue == 'Qualified'){
            return 'Qualified';
        }else if(selectedValue == 'Unqualified'){
            return 'Unqualified';
        }else if(selectedValue == 'Incorrect Number'){
            return 'Unqualified';
        }else if(selectedValue == 'Meeting Scheduled'){
            return 'Meeting Scheduled';
        }else if(selectedValue == 'Meeting Outcome'){
            return 'Meeting Outcome';
        }else if(selectedValue == 'Won'){
            return 'EOI/Cheque Collection';
        }else if(selectedValue == 'EOI/Cheque Collection' ){
            return 'Booking Confirmed';
        }else if(selectedValue == 'Follow Up 1' ){
            return 'Follow Up 1';
        }else if(selectedTabLabel1 == 'Follow Up 1' && (selectedValue == 'Call Again' || selectedValue == 'Whatsapp Sent' || selectedValue == 'Email Sent') ){
            return 'Follow Up 2';
        }else if(selectedTabLabel1 == 'Follow Up 2' && (selectedValue == 'Call Again' || selectedValue == 'Whatsapp Sent' || selectedValue == 'Email Sent') ){
            return 'Follow Up 3';
        }
            else {
            return null; // Return null if the picklist element is not found
        }
    },
    
    
    fetchAndSetCurrentPicklistValue: function(component, fieldName) {
        
        var recordId = component.get("v.recordId");
        
        var action = component.get("c.getCurrentPicklistValue");
        action.setParams({
            "recordId": recordId,
            "fieldName": fieldName
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var currentValue = response.getReturnValue();
                console.log('currentValue',currentValue);
                component.set("v.picklistValue", currentValue);
            } else {
                console.error("Error fetching current picklist value: " + response.getError());
            }
        });
        
        $A.enqueueAction(action);
    },
    
    handleTabSelect: function(component, event, helper) {
        
        var tab=  component.get("v.selectedTab");
        var qual=  component.get("v.quali");
        var selectedTabLabel = component.get('v.selectedTabb');
        console.log('qual--->>>>>>->handleTabSelect() :', qual);
        console.log('tab--->>>>>>->handleTabSelect() :', tab);
        console.log('selectedTabLabel--->>>>>>-> handleTabSelect():', selectedTabLabel);
        component.set("v.selectedTabb",selectedTabLabel);
        var selectedFieldName;
        if (selectedTabLabel === 'Contact Made') {
            selectedFieldName = 'Contactable__c';
        } else if (selectedTabLabel === 'Qualification') {
            selectedFieldName = 'Qualification_Status__c';
        }else if (selectedTabLabel === 'Qualified') {
            selectedFieldName = 'Qualified__c';
        }
        
        console.log('selectedFieldName------> handleTabSelect():', selectedFieldName);
        var action = component.get("c.getPicklistValuesForContactable");
        console.log('action',action)
        action.setParams({
            "tabSelected": selectedTabLabel
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log('Response State:', state);
            component.set("v.picklistOptions", null);
            if (state === "SUCCESS") {
                var picklistValues = response.getReturnValue();               
                component.set("v.picklistOptions", picklistValues);
                component.set("v.selectedTab", selectedTabLabel);
                component.set("v.picklistValue" , picklistValues[0]);
                // Switch to the Qualification tab
                helper.fetchAndSetCurrentPicklistValue(component, selectedFieldName);   
            }
        });
        
        $A.enqueueAction(action);
    },   
})