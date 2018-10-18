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


Horned.prototype.render = function() {
  //refactor for handlebars
  $('main').append('<div id="copy"></div>');
  let $imgContainer = $('div[id = "copy"]');
  let $imgTemplate = $('#photo-template').html();


  $imgContainer.html($imgTemplate);

  $imgContainer.find('img').attr('src', this.url);
  $imgContainer.attr('data-keyword', this.keyword);
  $imgContainer.find('img').attr('data-horns', this.horns);
  $imgContainer.find('img').attr('alt', this.keyword);
  $imgContainer.find('h2').text(this.title);
  $imgContainer.find('p').text(this.description);

  $imgContainer.removeAttr('id');
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
//page selected param
 function readData() {
   $.get('../data/page-1.json', data => {
     data.forEach(obj => {
       new Horned(obj);
     });
   }).then(renderImages);
 }

function checkKeywords() {

  objArray.forEach(obj => {
    if (!keywordArray.includes(obj.keyword)) {
      keywordArray.push(obj.keyword);
    }
  });
}

function addOptionEl() {
//refactor to handlebars
  keywordArray.forEach(keyword => {
    $('select').append('<option id = "temp"></option>');
    $('#temp').text(keyword).attr('value', keyword).removeAttr('id');
  });
}

readData(); 
addOptionEl();

$('select').on('change', function(){
  let $select = $(this).val();
  $('div').hide();
  $(`div[data-keyword="${$select}"]`).show();
})

//button submit handler
  //delete all main content
  //re-render with targeted JSON
