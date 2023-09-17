({
    init: function(component, event, helper) {
        var recordId = component.get("v.recordId");
         // Get the record type Id using a server-side action
        var getRecordTypeIdAction = component.get("c.getRecordTypeId");
        getRecordTypeIdAction.setParams({
            "recordId": recordId
        });
        
        getRecordTypeIdAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                var recordTypeId = response.getReturnValue();
                component.set("v.recordTypeId", recordTypeId); // Store the record type Id
                var action = component.get("c.getPicklistValues");
                console.log('action------', action);
                action.setParams({
                    "recordTypeId": recordTypeId,
                    "picklistField": "Lead_Status__c" // Adjust the field name as needed
                });
                
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        var picklistValues = response.getReturnValue();
                        
                        var tabToFieldMapping = {
                            "No Anwser": "Whatsapp_Call__c",
                            "Contact Made": "Contactable__c",
                            "Qualification":"Qualification_Status__c"
                            //"Status":"Status_Tab__c"
                            // Define other mappings here
                        };
                        
                        var tabs = [];
                        for (var i = 0; i < picklistValues.length; i++) {
                            var tabLabel = picklistValues[i];
                            tabs.push({
                                label: tabLabel,
                                content: '...',
                                fieldName: tabToFieldMapping[tabLabel] // Set the field based on the tab label
                            });
                        }
                        component.set("v.tabs", tabs);
                        console.log('TABS------', tabs);
                        helper.setDefaultPicklistValue(component);
                    } else {
                        console.error("Error fetching picklist values: " + response.getError());
                    }
                });
                
                $A.enqueueAction(action);
            } else {
                console.error("Error fetching record type Id: " + response.getError());
            }
        });
        console.log('before   handleTabSelect Values');
        
        
        $A.enqueueAction(getRecordTypeIdAction);
        //var customFieldValue = component.get('v.recordData.fields.Enquiry_Status_c.value');
        //console.log('customFieldValue', customFieldValue);
        //component.set("v.tabSavedValue", customFieldValue);
        ///
        //
        //fetchEnquiryStatusPicklistValue
        var getEnquiryStatus = component.get("c.fetchEnquiryStatusPicklistValue");
        getEnquiryStatus.setParams({
            "recordId": recordId
        });
        getEnquiryStatus.setCallback(this, function(response) {
            //console.log('-> ///')
            var state = response.getState();
            //console.log('-> ///',state)
            
            if (state === "SUCCESS") {
                ///test code
                

                var returnResponse = response.getReturnValue();
                var statusName = '';
                var numAttempts = 0;
                //var matches = returnResponse.match(/([A-Za-z]+\s\d+)([#])(\d+)/);
                //  console.log('returnResponse, ',returnResponse)
                var matches = returnResponse.split('#');
                
                console.log('matches, ',matches)
                // console.log('matches a, ',matches[1])
                //console.log('matches b, ',matches[3])
                
                if(matches){
                    statusName = matches[0];  
                    numAttempts = parseInt(matches[1], 10) ;
                    component.set("v.tabSavedValue", statusName); // Store the record type Id
                    
                }
                else{
                    //If in case of error, Set default values
                    numAttempts = 0;
                    component.set("v.tabSavedValue", "Lead Status"); // Store the record type Id
                    
                }
                console.log('statusName : ',statusName)
                console.log('numAttempts, ',numAttempts)
                
                console.log('Yes got it : ', statusName)
                
                var booleanList = Array.from({ length: 13 }, () => false);
                
                // Set the attribute value to make it accessible in the Aura markup
                component.set('v.booleanList', booleanList);
                setTimeout(function() {
                    component.set('v.isFourVisible', true);
                }, 1000); 
                console.log('BooleanList', component.get('v.booleanList'))
                console.log('TabList', component.get('v.TabList'))
                ///
                
                var tabList = component.get('v.TabList');
                var tabSavedValue  = statusName;
                console.log('tabSavedValue :' ,tabSavedValue)
                var booleanList = component.get('v.booleanList');
                var foundTab = true;
                var count = 0;
                //var AttemptName = 1;
                for (var i = 0; i < tabList.length; i++) {
                    console.log('tabList[i] === tabSavedValue : ' ,tabList[i] ,',',tabSavedValue)
                    if (tabList[i] === tabSavedValue) {
                        foundTab = false;
                    }
                   
                    if (tabList[i] === "Attempt 1" || tabList[i] === "Attempt 2" || tabList[i] === "Attempt 3") {
                        console.log('inside Attempts', numAttempts);
                        var numericValue = parseInt(tabList[i].match(/\d+/)[0], 10);
                        
                        if(numericValue <= numAttempts){
                            console.log('inside Attempt single' , numAttempts )
                            
                            booleanList[i] = true;
                            
                        }
                        else{
                            console.log('not found inside attempt' , numAttempts )
                            
                            booleanList[i] = false;
                            
                        }
                    }
                    else{
                        booleanList[i] = true;
                        
                    }
                    if(!foundTab){
                        
                        console.log("component.get('v.selectedTab') before: ",component.get('v.selectedTab')); 
                        
                        component.set("v.selectedTab", tabSavedValue);
                        
                        console.log("component.get('v.selectedTab') after: ",component.get('v.selectedTab')); 
                        
                        break;
                        
                    }
                    if(tabList[i] === 'Unqualified' && foundTab === true ){
                        booleanList[i] = false;
                    }
                }
                console.log('BOOLEAN ATTEMPTS. ', booleanList)
                if(foundTab){
                    var booleanList1 = Array.from({ length: 13 }, () => false);
                    console.log('BooleanList if', component.get('v.booleanList'))
                    
                    component.set('v.booleanList', booleanList1);
                }
                else{
                    component.set('v.booleanList', booleanList);
                    console.log('BooleanList after', component.get('v.booleanList'))
                    for (var j = 0; j < booleanList.length; j++) {
                        var tabAttrName = 'v.Tab' + (j + 1);
                        component.set(tabAttrName, booleanList[j]);
                    }
                }
                
            } else {
                console.error("Error fetching record type Id: " + response.getError());
            }
        });
        
        $A.enqueueAction(getEnquiryStatus);
        window.setTimeout(function(){
            const username = component.get('v.CurrentUser')['Profile'].Name;
            console.log('profile is : ', username)
            
            var divElement = document.getElementById('test')
            if (divElement) {
                console.log('test print1 : ', divElement)
                
                divElement.classList.add("testClass");
            }
        }, 0);
        helper.handleTabSelect(component);
       
        console.log('AFTER   handleTabSelect Values');
    },
    
    handleSelect: function(component, event, helper) {
        var selectedValue = component.get("v.picklistValue");
        var returnedValue = helper.getTabValue(selectedValue);
        console.log('getting Picklist--------->')
        component.set("v.outputValue", returnedValue);
    },
    applyCSS: function(cmp, event) {
        var cmpTarget = cmp.find('changeIt');
        $A.util.addClass(cmpTarget, 'changeMe');
    },
    
    removeCSS: function(cmp, event) {
        var cmpTarget = cmp.find('changeIt');
        $A.util.removeClass(cmpTarget, 'changeMe');
    },
    
    savePicklist: function(component, event, helper) {
        console.log('save Picklist--------->')

        console.log('test print : ', component.getElements())
        var selectedValue = component.get("v.picklistValue");
        var selectedTabLabel = component.get("v.selectedTabLabel");
        
        //toggleOptionalTab(component);
        //var Statusddd = component.get("v.Status");
        // console.log("Enquiry Status", component.set('v.Enquiry_Status__c',selectedValue));
        console.log("selectedValue ",selectedValue);
        console.log("selectedTabLabel ",selectedTabLabel);
        //console.log('save selectedValue--------->' ,Statusddd)
        var selectedFieldName;
        if (selectedTabLabel === 'Contact Made') {
            selectedFieldName = 'Contactable__c';
        }else if (selectedValue === 'Contactable') {
            console.log('qual--->>>>>>- 2222 :', selectedValue);
            component.set("v.quali" ,  selectedValue);
            
            selectedFieldName = 'Qualification_Status__c';
        }else if(selectedValue === 'QUALIFIED'){
            component.set("v.quali" ,  selectedValue);
        }
        
        var qual=  component.get("v.quali");
        console.log('qual--->>>>>>- :', qual);

         //////////////////////////////////////////////FollowUp1 Comment///////////////////////////////////////////
  /* var f1Comment = component.find("f1Comment").get("v.value");
   console.log('inputValue',f1Comment);
   
   // Call the Apex method to update the object
   //if(f1Comment  != null){
   var action = component.get("c.followUp1Comment");
console.log('Action',action)
   action.setParams({
       recordId: component.get("v.recordId"), // The ID of the object record
       f1Comment: f1Comment
   });

   action.setCallback(this, function(response) {
       var state = response.getState();
       console.log('stateeeeeeeeeet',state);
       if (state === "SUCCESS") {
        console.log('stateeeeeeeeee',state);
   //        // Object record updated successfully
           //component.set("v.f1Comment", f1Comment); // Update the displayed value
       } else {
           console.log("Error: " + JSON.stringify(response.getError()));
       }
   });

   $A.enqueueAction(action);

   
  // }*/
     
   //////////////////////////////////////////////FollowUp1 Comment///////////////////////////////////////////
        //////////////////////////////////////////////FollowUp2 Comment///////////////////////////////////////////






















        //////////////////////////////////////////////FollowUp2 Comment///////////////////////////////////////////
        //////////////////////////////////////////////FollowUp3 Comment///////////////////////////////////////////
























        //////////////////////////////////////////////FollowUp3 Comment///////////////////////////////////////////






        var eoiCollection = component.find("inputField");//.get("v.value");
        console.log('Only find',eoiCollection);
        //var eoi = eoiCollection.get("v.value");
         if(eoiCollection != null){
                   console.log('eoiCollection',eoiCollection);
                   selectedValue = 'EOI/Cheque Collection';
         }
        
        if(eoiCollection != null){
        var inputValue = component.find("inputField").get("v.value");
        console.log('inputValue',inputValue);
        var dropdownValue = component.find("dropdownField").get("v.value");;
        console.log('dropdownValue',dropdownValue);
        var textAreaValue = inputValue + ' ' + dropdownValue;
        console.log('textAreaValue',textAreaValue);
        // Call the Apex method to update the object
        if(inputValue  != null){
        var action = component.get("c.updateObject");
        action.setParams({
            recordId: component.get("v.recordId"), // The ID of the object record
            textAreaValue: textAreaValue
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Object record updated successfully
                component.set("v.textAreaValue", textAreaValue); // Update the displayed value
            } else {
                console.log("Error: " + JSON.stringify(response.getError()));
            }
        });

        $A.enqueueAction(action);
    
        
        }
        }

        
        
        //
        // Assuming you have already retrieved the selectedTabLabel and recordId
        var recordId = component.get("v.recordId");
        var nextTab = helper.getTabValue(selectedValue)
        console.log('nextTab : ', nextTab)
        var numericValue = 0;
        // Check if the nextTab contains "Attempt 1," "Attempt 2," or "Attempt 3"
        if (nextTab == "Attempt 1" || nextTab == "Attempt 2" || nextTab == "Attempt 3") {
            // Extract the numeric value from the selectedTabLabel
            numericValue = parseInt(nextTab.match(/\d+/)[0], 10);
            console.log('numericValue : ' , numericValue)            
            console.log('recordId : ' , recordId)            
            console.log('nextTab : ' , nextTab)            
        } else {
            
            // Handle the case when selectedTabLabel does not contain "Attempt 1," "Attempt 2," or "Attempt 3"
            console.log("Selected tab does not contain 'Attempt 1,' 'Attempt 2,' or 'Attempt 3.'");
        }
        
        if(nextTab != null){
        // Call the Apex controller method to update the attempts
        var action = component.get("c.updateAttempts");
        action.setParams({
            "noOfAttempts": numericValue > 0 ? numericValue : 0,
            "currentStatus":nextTab,
            "RecordId": recordId
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Handle success, if needed
                console.log("Attempts updated successfully.");
            } else if (state === "ERROR") {
                // Handle errors, if needed
                var errors = response.getError();
                if (errors) {
                    console.error("Error in attempts: " + errors[0].message);
                }
            }
        });
        
        $A.enqueueAction(action);
        }
   
        //var flag = true;
        // Aura (recordID) reuturn reason;
        var fetchArchivalReason = component.get("c.fetchArchivalReason");
        fetchArchivalReason.setParams({
            "recordId": recordId
        });
        
        fetchArchivalReason.setCallback(this, function(response) {
            var state = response.getState();
            var returnResponse = response.getReturnValue();
            var selectedValue1 = component.get("v.picklistValue");
            console.log('selectedValue for lost',selectedValue);
            if (state === "SUCCESS") {
                
                // Handle success, if needed
                //  || (returnResponse == null && nextTab == 'Lost' && selectedTabLabel == 'Meeting Outcome')
                //  
                if(returnResponse == null && nextTab == 'Unqualified' ||  returnResponse==null && selectedValue1 == 'Not Interested'){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title: "Error",
                        message: "Let us know why Unqualified",
                        type: "error"
                    });
                    toastEvent.fire();
                }
                else{ 
                    helper.updatePicklistField(component, selectedFieldName, selectedValue, function(response) {
                        if (response === "SUCCESS") {
                            
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                title: "Success",
                                message: "Picklist field updated successfully.",
                                type: "success"
                            });
                            
                            
                            toastEvent.fire();
                            
                            var valueSelect = helper.getTabValue(selectedValue)
                            var tabList = component.get('v.TabList'); 
                            var booleanList = component.get('v.booleanList');
                            var foundTab = true;
                            for (var i = 0; i < tabList.length; i++) {
                                console.log('tabList[i] === tabSavedValue : ' ,tabList[i] ,',',valueSelect)
                                if (tabList[i] === valueSelect) {
                                    booleanList[i] = true;
                                    break;
                                }
                                
                            }
                            component.set('v.booleanList',booleanList)
                            console.log('BooleanList after', component.get('v.booleanList'))
                            for (var j = 0; j < booleanList.length; j++) {
                                var tabAttrName = 'v.Tab' + (j + 1);
                                component.set(tabAttrName, booleanList[j]);
                            }
                            console.log('Selected tab label',selectedTabLabel);
                            setTimeout(function() {
                                var selectedTabLabel1 = component.get("v.selectedTabLabel");
                                console.log("component.get('v.selectedTab') before: ",component.get('v.selectedTab'),'selectedvalue : ',selectedValue);
                                
                                component.set("v.selectedTab", helper.getTabValue(selectedValue,selectedTabLabel1));
                                console.log("component.get('v.selectedTab') after: ",component.get('v.selectedTab')); 
                            }, 1000);                                
                            
                        } 
                        else {
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                title: "Error",
                                message: "An error occurred while updating the picklist field.",
                                type: "error"
                            });
                            toastEvent.fire();
                        }
                    });
                    console.log('calling 1')
                    helper.handleTabSelect(component);
                    console.log('calling 2')
                }
            } 
            else if (state === "ERROR") {
                // Handle errors, if needed
            }
        });
        
        $A.enqueueAction(fetchArchivalReason);
        
       
    },
 
    toggleOptionalTab: function (component) {
        
        component.set('v.isFourVisible', !component.get('v.isFourVisible'));
        
    },
    handleSave: function(component, event, helper) {
        var picklistFieldName = component.get("v.picklistFieldName");
        console.log('picklistFieldName in handle save',picklistFieldName);
        var untouchedValue = component.get("v.Untouched");
        var contactMadeValue = component.get("v.contactMade");
        var recordId = component.get("v.recordId");
        var selectTab = component.get("v.selectedTabb");
        var selectval = component.get("v.picklistVal");
        console.log('selectTab in handle save',selectTab);
        console.log('selectval in handle save',selectval);
        //component.set("v.selectedTabb","Qualification");
        var picklistFieldName = component.get("v.picklistFieldName");
        console.log('picklistFieldName in handle save',picklistFieldName);
        /*  if( picklistFieldName == 'Untouched__c'){
         console.log('hiiiiiiiiiiiiiiii');
        // Call the Apex method using an action
        var action = component.get("c.updateData");
        action.setParams({
            "untouchedParam": untouchedValue,
            "contactMadeParam": contactMadeValue,
            "recordId" : recordId
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                // Handle success if needed
            } else if (state === "ERROR") {
               console.log('error------>' , error)
            }
        });
            
        $A.enqueueAction(action);
    }*/
        console.log('calling 1-------->')
        helper.handleTabSelect(component);
        console.log('calling 2-------->')
    },
    handlePicklist:function(component, event, helper) {
        console.log('called ');
        var picklistFieldName = component.get("v.picklistFieldName");
        console.log('picklistFieldName in handlePicklist',picklistFieldName); 
        var picklistFieldName = component.get("v.picklistFieldName");
        console.log("Picklist Field Name: " + picklistFieldName);
        
        var selectedValue = component.get("v.picklistValue");
        component.set("v.selectedTabb",selectedValue);
        component.set("v.picklistVal" , selectedValue);
        if( picklistFieldName == 'Untouched__c'){
            component.set("v.Untouched" ,selectedValue );
            component.set("v.selectedTabb",selectedValue);
            console.log('called  inside');
        }
        if( picklistFieldName == 'ContacMade__c'){
            component.set("v.contactMade" ,selectedValue ); 
        }
        var unt = component.get("v.Untouched")
        //console.log('called  unt=====> ' , unt)
        component.set("v.selectedTab", "No Anwser");
        var picklistValue = component.get("v.picklistValue");
        component.set("v.selectedTab",picklistValue);
        if (selectedValue == "No Anwser") {
            
            
        } else {
            // Set default tab or adjust based on your logic
            
            component.set("v.selectedTab", selectedValue);
        }
        console.log('calling helper of handleTabSelect 1');   
        helper.handleTabSelect(component);
        console.log('call 2');        
    },
    SelectedhandleTabSelect: function(component, event, helper) {
        console.log('SelectedhandleTabSelect 1')      
        var tabId = event.getSource().get('v.id');
        console.log("Tab id",tabId)
        component.set("v.selectedTabb",tabId);
        var selectedTabLabel = component.get("v.selectedTabb");
        console.log('tabId--------------- :', tabId);
        if(selectedTabLabel == 'Qualification'){
            console.log('qui-=====================')
        }
        console.log('tabId----selectedTabLabel----------- :', selectedTabLabel);
        component.set("v.selectedTab", selectedTabLabel);
        console.log('tabId----selectedTabLabel----------- :', component.get("v.selectedTab"));
        component.set("v.selectedTabLabel", selectedTabLabel); // Update the selected tab label attribute
        // Rest of your handleTabSelect logic
        // ...
        helper.handleTabSelect(component);
    },
    
})