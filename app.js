

// budget controller

var budgetController = ( function() {
    
    // for expense objects 


    var Expense = function ( id ,description,value){

        this.id=id;
        this.description= description;
        this.value=value;
        this.percentage = -1 ;

    };

    Expense.prototype.calcPercentage = function (totalIncome){
        if (totalIncome >0){
        this.percentage = Math.round((this.value / totalIncome)*100);
        } else {
            this.percentage = -1 ;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
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
        
        deleteItem: function(type, id) {
            var ids, index;
                               
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            console.log(ids);
            console.log(id);

            index = ids.indexOf(id);
            console.log(index);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },

        calculateBudget : function () {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');


            // calculate the budget income-expense
            data.budget = data.totals.inc - data.totals.exp;


            // percentage of income spent
            if (data.totals.inc > 0){
             data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100 );
            //  check
            } else {
                data.percentage = -1;
            }
           
        },


        calculatePercentages : function () {
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages : function(){
            var allPerc = data.allItems.exp.map(function(cur){
                    return cur.getPercentage();
            });
            return allPerc;
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
        expensesContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expenseLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        container : '.container',
        expensesPercLabel : '.item__percentage',
        dateLabel : '.budget__title--month'


    };

    formatNumber = function (num ,type){
        var numSplit,int,dec;

        num =Math.abs(num);
        num=num.toFixed(2);
        numSplit = num.split('.');

        int =numSplit[0];
        dec = numSplit[1];
        if(int.length > 3){
            int = int.substr(0,int.length - 3) + ',' +int.substr(int.length - 3,3);
        }

        type === 'exp' ? sign = '-' : sign = '+';

        return sign + ' ' + int + '.' + dec;
    };
    return{

        getinput: function() {
            
            return{
             
                type : document.querySelector(DOMstrings.inputType).value, // inc or exp
             description : document.querySelector(DOMstrings.inputDescription).value,
             value : parseFloat(document.querySelector(DOMstrings.inputValue).value),
            
            }
        },
        addlistItem : function (obj ,type){


            // create HTML strings with placeholder text
            if(type === 'inc'){
            element = DOMstrings.incomeContainer;
            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp') { 
            element = DOMstrings.expensesContainer;        
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';         
            }


            //  repace placeholder with data
            newHtml = html.replace('%id%',obj.id);   
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));    



            // insert html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

        deleteListItem : function(selectorID) {
             var ele = document.getElementById(selectorID);
            ele.parentNode.removeChild(ele);
        } ,


        clearFields : function(){
            var fields,fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' +DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,array){
                current.value = "";

            });
            fieldsArr[0].focus();
        },
        displayBuget : function(obj){
             document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
             document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
             document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
            if( obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent= '---';
            }
             
        },

        displayPercentages : function(percenatges) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            var NodeListForEach = function (list , callback){
                for (var i=0; i<list.length; i++){
                    callback(list[i] , i);
                }
            };
            
            
            
            NodeListForEach (fields , function(current , index){
                if (percenatges[index] > 0) {
                    current.textContent = percenatges[index]  + '%' ;
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth : function (){
            var now = new Date();
            month = now.getMonth()
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = month+1+'/'+ year;
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
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    

    }


    var DOM = UICtrl.getDomstrings();
    var newItem,input;
    
    var updateBudget = function(){
        // 1. calculate budget
        budgetCtrl.calculateBudget();

        //  2.Return the budget
        var budget = budgetCtrl.getBudget();

        // 3.display budget on the UI
        UICtrl.displayBuget(budget);
        



    };
    
    var updatePercentages = function () {

        // 1.calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. read percentages from budget controller
        var percenatges = budgetCtrl.getPercentages();


        // 3. update the UI with new percentages
        UICtrl.displayPercentages(percenatges);

    };
    var ctrlAddItem = function() {
        
        // 1. get the filed input data
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

        // update percenatges
        updatePercentages();

        } 

      

          

    };

    var ctrlDeleteItem = function(event){
        var itemID,splitID,type,id;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);
           
        // delete item from data structure
        console.log(type,id);
        budgetCtrl.deleteItem(type , id);



        // delete item from UI
        UICtrl.deleteListItem(itemID);


        // Update and show the new budget
        updateBudget();

        // update percentages
        updatePercentages();


        
;
        }
    };

    return {
        init : function() {
            console.log('Application Has started');
            UICtrl.displayMonth();
            UICtrl.displayBuget({
                budget :0 ,
                totalInc : 0,
                totalExp : 0,
                percentage : -1

            });
            setupEventListeners();

        }

    }
   


})(budgetController,UIController);




controller.init();