var taskList = [];
var nextKey;

class Task  {
  constructor(id, shortName, description, dueDate, completed, parentID){
    if(id[0] === '{'){
      var obj = JSON.parse(id);
      for (var key in obj){
        this[key] = obj[key];
      }
    }else {
      this.id = id;
      this.shortName = shortName;
      this.description = description;
      this.dueDate = dueDate;
      this.completed = completed;
      this.parentID = parentID;
    }
  }

  stringify(){
    return JSON.stringify(this);
  }
}

var updateData = function(task){
 // console.log(task);
  var taskFound = false;
  for (var item in taskList){
    if (taskList[item].id === task.id) {
      for (var key in taskList[item]){
        taskList[item][key] = task[key];
      }

      taskFound = true;
    }
  }
  if(!taskFound){
    taskList.push(task);
  }
 // console.log(taskList);
  localStorage.setItem('taskData', JSON.stringify(taskList));
}

var loadTableData = function(fromArray){
  if(!fromArray){  //Only load data from taskList Array on load of page.
    taskList = JSON.parse(localStorage.getItem('taskData'));
    if(taskList === null){
      taskList = [];
    }
  }

  nextKey = 0;
  var $gridDataContainer = $('.grid-container-table');
  $gridDataContainer.empty();
    
  var gridHeaderRowString = '<div class="grid-cell-header"></div><div class="grid-cell-header"><p>Completed</p></div><div class="grid-cell-header"><p>Task</p></div><div class="grid-cell-header"><p>Description</p></div><div class="grid-cell-header"><p>Due Date</p></div>';
  
  $gridDataContainer.append(gridHeaderRowString);

  var rowStyle =  "oddRow";

  for (var task in taskList){
     if(taskList[task].parentID === '0'){
        
        divRowString = "";
        if(taskList[task].completed){
          divRowString += `<div class="cell-chevron ${rowStyle}" data-parentValue="${taskList[task].id}">&#9654;</div><div class="cell-checkbox  ${rowStyle}"><p> <input class="input-checkbox" data-keyValue="${taskList[task].id}" type= "checkbox" checked></p></div>`;
        }else{
          divRowString += `<div class="cell-chevron  ${rowStyle}" data-parentValue="${taskList[task].id}">&#9654;</div><div class="cell-checkbox  ${rowStyle}"><p> <input class="input-checkbox" data-keyValue="${taskList[task].id}" type= "checkbox" ></p></div>`;
        }  
        divRowString += `<div class="cell cell-nowrap  ${rowStyle}" data-keyValue="${taskList[task].id}"><p>${taskList[task].shortName}</p></div>`;
        divRowString += `<div class="cell  ${rowStyle}" data-keyValue="${taskList[task].id}"><p>${taskList[task].description}</p></div>`;
        divRowString += `<div class="cell cell-nowrap ${rowStyle}" data-keyValue="${taskList[task].id}"><p>${taskList[task].dueDate}</p></div>`;
        $gridDataContainer.append(divRowString);

        if(rowStyle === "oddRow"){
          rowStyle = "evenRow";
        }else{
          rowStyle = "oddRow";
        }
        var subRowStyle =  "oddRow";
        var subRowString = `<div class="grid-container-subtable" id="parent${taskList[task].id}"><div class="grid-cell-header"><p>Completed</p></div><div class="grid-cell-header"><p>Task</p></div><div class="grid-cell-header"><p>Description</p></div><div class="grid-cell-header"><p>Due Date</p></div>`;
        for (var subtask in taskList){
          if(taskList[task].id===taskList[subtask].parentID){
            if(taskList[subtask].completed){
              subRowString += `<div class="cell-checkbox ${subRowStyle}"><p> <input class="input-checkbox" data-keyValue="${taskList[subtask].id}" type= "checkbox" checked></p></div>`;
            }else{
              subRowString += `<div class="cell-checkbox ${subRowStyle}"><p> <input class="input-checkbox" data-keyValue="${taskList[subtask].id}" type= "checkbox" ></p></div>`;
            }  
            subRowString += `<div class="cell cell-nowrap ${subRowStyle}" data-keyValue="${taskList[subtask].id}"><p>${taskList[subtask].shortName}</p></div>`;
            subRowString += `<div class="cell ${subRowStyle}" data-keyValue="${taskList[subtask].id}"><p>${taskList[subtask].description}</p></div>`;
            subRowString += `<div class="cell cell-nowrap ${subRowStyle}" data-keyValue="${taskList[subtask].id}"><p>${taskList[subtask].dueDate}</p></div>`;
            if(subRowStyle === "oddRow"){
              subRowStyle = "evenRow";
            }else{
              subRowStyle = "oddRow";
            }
          }   

          if(Number(taskList[subtask].id) > nextKey){
            nextKey = Number(taskList[subtask].id);
          } 

        }

      subRowString += `<button class="btn-new" data-parentvalue="${taskList[task].id}">Add Subtask</button></div>`
      $gridDataContainer.append(subRowString);
      }
    } 
  nextKey++;
  $('.input-key').val(nextKey);
}

var updateCompletedStatus = function(key, completed){
  var taskFound = false;
  for (var item in taskList){
    if (taskList[item].id === key) {
      if(completed === undefined){
        taskList[item].completed = !taskList[item].completed;
      }else{
        taskList[item].completed = completed;
      }
    }
  }
  localStorage.setItem('taskData', JSON.stringify(taskList));
}

var loadTaskIntoForm = function(keyData){
  var taskFound = false;
  for (var item in taskList){
    if (taskList[item].id === keyData) {
      $('.input-key').val(taskList[item].id);      
      $('.input-parent').val(taskList[item].parentID);
      $(".input-completed").prop("checked", taskList[item].completed);
      $('.input-name').val(taskList[item].shortName);
      $('.input-description').val(taskList[item].description);
      $('.input-due-date').val(taskList[item].dueDate);

   //   console.log('|'+ taskList[item].dueDate + '|')
      taskFound = true;
     }
  }
}

var deleteTask = function(id){
  for (var item in taskList){
    if (taskList[item].id === id) {
      taskList.splice([item], 1)
    }
  }
 loadTableData(true)
 localStorage.setItem('taskData', JSON.stringify(taskList));
}


$(document).ready(function(){
  loadTableData();
  
  $('.input-key').val(nextKey);

  $('.btn-update').on('click', function(e){
    //console.log(e);
    
    var keyData = $('.input-key').val();
    var parentData = $('.input-parent').val();
    var nameData = $('.input-name').val();
    var descriptionData = $('.input-description').val();
    var dueDate = $('.input-due-date').val();
   // console.log($('.input-description'.val()));
   
    var completed = false;
    if ($('.input-completed').is(":checked")){
      completed = true;
    }
    $('.btn-update').html('Update');

    var newTask = new Task(keyData, nameData, descriptionData, dueDate, completed, parentData);
    
    nextKey++;
    $(".input-completed").prop("checked", false);
    $('.input-key').val(nextKey);
    $('.input-name').val('');
    $('.input-description').val('');
    $('.input-due-date').val('');
    $('.input-completed').val(":unchecked");
    $("#myForm").css("display", "none");

    updateData(newTask);
    loadTableData(true);
  });


  // update db
    // need to expand when  more than 1 item is added

  // load item on click
  $('.grid-container-table').on('click', '.cell', function(e){
    
    var keyData = e.currentTarget.dataset.keyvalue;
    $("#myForm").css({left: e.pageX});
    $("#myForm").css({top: e.pageY});
    $("#myForm").css("display", "block");
    loadTaskIntoForm(keyData);

  });
  $('.grid-container-table').on('click', '.input-checkbox', function(e){
    var keyData = e.currentTarget.dataset.keyvalue;
    updateCompletedStatus(keyData);
  });
  

  $('.grid-container-table').on('click', '.cell-chevron', function(e){
    console.log('in chevron')
    var parentData = '#parent';
    parentData += e.currentTarget.dataset.parentvalue;

    if(e.target.innerHTML == '▼'){
      e.target.innerHTML = '&#9654;';
      $(parentData).css("display", "none");      
    }                       
    else{
       e.target.innerHTML = '&#9660;';
      $(parentData).css("display", "grid");
    }
  });




  // delete all?
  $('.btn-clear').click(function(){
    //localStorage.clear();
    $('.input-key').val(nextKey);
    $('.input-name').val('');
    $('.input-description').val('');
    $('.input-due-date').val('');

   });
  $('.btn-delete').click(function(){
    deleteTask($('.input-key').val());
    $('.input-key').val(nextKey);
    $('.input-name').val('');
    $('.input-description').val('');
    $('.input-due-date').val('');
    $("#myForm").css("display", "none");
  });

  $('.grid-container-table').on('click','.btn-new', function(e){
    $('.input-key').val(nextKey);
    
    if(e.currentTarget.parentNode.className === 'container-main'){
      $('.input-parent').val("0");
    }else{
       $('.input-parent').val(e.currentTarget.dataset.parentvalue)
     }
    $('.input-name').val('');
    $('.input-description').val('');
    $('.btn-update').html('Add');

    var nowDate = new Date();
      month = '' + (nowDate.getMonth() + 1),
      day = '' + nowDate.getDate(),
      year = nowDate.getFullYear();
    if(month.length<2) month = '0' + month;
      
    $('.input-due-date').val(year + '-'+ month + '-' + day);
    $("#myForm").css({left: 100});
    $("#myForm").css({top: 50});
    $("#myForm").css("display", "block");
  });

  $('.btn-new').on('click', function(e){
    $('.input-key').val(nextKey);
    $('.input-parent').val("0");
    $('.input-name').val('');
    $('.input-description').val('');
    $('.btn-update').html('Add');

    var nowDate = new Date();
      month = '' + (nowDate.getMonth() + 1),
      day = '' + nowDate.getDate(),
      year = nowDate.getFullYear();
    if(month.length<2) month = '0' + month;
      
    $('.input-due-date').val(year + '-'+ month + '-' + day);
    $("#myForm").css({left: 100});
    $("#myForm").css({top: 50});
    $("#myForm").css("display", "block");
  });

  $('.btn-close').click(function(){
    $("#myForm").css("display", "none");

  });

});

