import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Router.route('/', {
    name: 'main',
    action: function () {
        this.render('main');
    }
});

if (Meteor.isClient) {

Template.main.events({
  'click .btnSubmit':function() {
    if(Template.main.__helpers.get('areBothChecksChecked').call() && $("#txtPhone").val().trim()!=""){   
    var param= '{ "phone": "'+$("#txtPhone")[0].value+'"}';
            $.post(
          "http://localhost:3000/api/sms-promotion",
         param,
          function(data) {
          if(data.error){
                $.notify(data.message,"error");
                }
                else
                {
                $.notify(data.message,"success");
                }
          }
        );
    }
    else
    {
     $.notify("Please check both checkboxes and enter a phone number","error");
    }
  },

   'click .chkCheck':function() {   
   var _areBothChecksChecked= Template.main.__helpers.get('areBothChecksChecked').call();
   if(_areBothChecksChecked)
   {
    document.getElementById('btnSubmit').disabled=false;
   }
   else{
   document.getElementById('btnSubmit').disabled=true;
   }
  }
});


   Template.main.helpers({
   areBothChecksChecked() {
var isChecked18= document.getElementById('checkBoxOver18').checked;
   var isCheckedAccept= document.getElementById('checkBoxOverAccept').checked;
   if(isChecked18 && isCheckedAccept)
   {
    return true;
   }
   else{
   return false;
   }
}
});
}