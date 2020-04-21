

// budget controller

var budgetController = ( function() {
    
    // for expense objects 


    var Expense = function ( id ,description,value){

        this.id=id;
        this.description= description;
        this.value=value;

    };
    
        // for income objects 

    var Income = function ( id ,description,value){

        this.id=id;
        this.description= description;
        this.value=value;

    };

    var calculateTotal = function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;

        });
        data.totals[type]=sum;


    };

    var data= {
        allItems : {
            exp : [],
            inc : []
            },
        totals : {
            exp : 0,
            inc : 0
        },
        budget : 0,
        percentage : -1,
    }

    return {
        addItem : function(type,des,val){

            var newItem,ID;

            // create new ID
            if(data.allItems[type].length>0){
            ID= data.allItems[type][data.allItems[type].length -1].id +1;
            } else {
                ID=0;
            }
            

            // create new item
            if (type==='exp') {
              newItem = new Expense(ID,des,val);
            } else if (type === 'inc'){
                newItem = new Income(ID,des,val);
            }
            

            //  enter new item into structure
            data.allItems[type].push(newItem);

            //  return the item    
            return newItem;
        },

        calculateBudget : function () {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');


            // calculate the budget income-expense
            data.budget = data.totals.inc - data.totals.exp;


            // percentage of income spent
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100 );

        },

        getBudget : function(){
            return {
                budget : data.budget,
                percentage : data.percentage,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp
            }
        },
    };

})();



// UI controller

var UIController = (function() {

    var DOMstrings = {
        
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value', 
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list'
        

    }
    return{

        getinput: function() {
            
            return{
             
                type : document.querySelector(DOMstrings.inputType).value, // inc or exp
             description : document.querySelector(DOMstrings.inputDescription).value,
             value : parseFLoat(document.querySelector(DOMstrings.inputValue).value),
            
            }
        },
        addlistItem : function (obj ,type){


            // create HTML strings with placeholder text
            if(type === 'inc'){
            element = DOMstrings.incomeContainer;
            html='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') { 
            element = DOMstrings.expensesContainer;        
            html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';         
            }


            //  repace placeholder with data
            newHtml = html.replace('%id%',obj.id);   
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);    



            // insert html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },


        clearFields : function(){
            var fields,fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' +DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,array){
                current.value = "";

            });
            fieldsArr[0].focus();
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
    var newItem,input;
    
    var updateBudget = function(){
        // 1. calculate budget
        budgetCtrl.calculateBudget();

        //  2.Return the budget
        var budget = budgetCtrl.getBudget();

        // 3.display budget on the UI



    };
       
    var ctrlAddItem = function() {
        
        // 1,get the filed input data
        input = UICtrl.getinput();
        
        if ( input.description !== "" && !isNaN(input.value) && input.value>0) {
             // 2. add item to budget controller
        newItem =  budgetCtrl.addItem(input.type,input.description,input.value);


        // 3.add the new item to the UI
        UICtrl.addlistItem(newItem,input.type);


        // 4.clear the fields
        UICtrl.clearFields();

        // 5.calculate and update  budget
        updateBudget();
        } 

      

          

    };

    return {
        init : function() {
            console.log('Application Has started');
            setupEventListeners();
        }

    }
   


})(budgetController,UIController);




controller.init();