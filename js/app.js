'use strict';

const objArray = [];
const keywordArray = [];

function Horned(animalObject) {
  this.url = animalObject.image_url;
  this.title = animalObject.title;
  this.description = animalObject.description;
  this.keyword = animalObject.keyword;
  this.horns = animalObject.horns;
  objArray.push(this);
}


function renderAnyHandlebars(sourceId, data, target) {
  let template = Handlebars.compile($(sourceId).html());
  let newHtml = template(data);
  $(target).append(newHtml);
}

//render all images
function renderImages() {
  objArray.forEach(obj => {
  renderAnyHandlebars('#horns-handlebars', obj, 'main');
  });
checkKeywords();
addOptionEl();
}

//read data and create objects
 function readData(dataFile='page-1') {
   resetData();
   $.get(`../data/${dataFile}.json`, data => {
     data.forEach(obj => {
       new Horned(obj);
     });
   }).then(renderImages);
 }

 function resetData() {
   $('main').html('');
   objArray.length = 0;
   keywordArray.length = 0;
 }

function checkKeywords() {
  objArray.forEach(obj => {
    if (!keywordArray.includes(obj.keyword)) {
      keywordArray.push(obj.keyword);
    }
  });
}

function addOptionEl() {
  $('select').html('<option value="default">Filter by Keyword</option>');
  keywordArray.forEach(keyword => {
    let keywordObj = {
      'keyword': keyword,
    }

    renderAnyHandlebars('#options-handlebars', keywordObj, 'select');
  });
}

readData(); 
addOptionEl();

$('select').on('change', function(){
  let $select = $(this).val();
  $('section').hide();
  $(`section[data-keyword="${$select}"]`).show();
})

//button submit handler
  //delete all main content
  //re-render with targeted JSON

$('button[value="page1"]').on('click', () => {
  readData('page-1');
});
$('button[value="page2"]').on('click', () => {
  readData('page-2');
});

