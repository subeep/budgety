// budget controller


var budgetController = ( function() {
    

    var Expense = function ( id ,description,value){

        this.id=id;
        this.description= description;
        this.value=value;

    };
    
    
    
    

    var Income = function ( id ,description,value){

        this.id=id;
        this.description= description;
        this.value=value;

    };

})();



// UI controller

var UIController = (function() {

    var DOMstrings = {
        
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value', 
        inputBtn : '.add__btn'

    }
    return{

        getinput: function() {
            
            return{
             
                type : document.querySelector(DOMstrings.inputType).value, // inc or exp
             description : document.querySelector(DOMstrings.inputDescription).value,
             value : document.querySelector(DOMstrings.inputValue).value,
            
            }
        },


        getDomstrings : function() {
         return DOMstrings ;
        }

    };

})();




//   Global app controller

var controller = ( function(budgetCtrl,UICtrl) {

    var setupEventListeners = function() {
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress' , function(event){
    
            if (event.keyCode=== 13 || event.which === 13 ) {
                ctrlAddItem();
            }
    
        });
    

    }

    var DOM = UICtrl.getDomstrings();
    
       
    var ctrlAddItem = function() {
        // 1,get the filed input data

        var input = UICtrl.getinput();
        

        // 2. add item to budget controller


        // 3.add the new item to the UI


        // 4. calculate budget


        // 5.display budget on the UI

          

    };

    return {
        init : function() {
            console.log('Application Has started');
            setupEventListeners();
        }

    }
   


})(budgetController,UIController);




controller.init();