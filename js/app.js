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

function sortByKey(arr) {
  arr.sort((a, b) => {
    if (a.keyword > b.keyword) {
      return 1;
    }
    else if (a.keyword < b.keyword) {
      return -1;
    }
    else {return 0;}
  });
}

function sortByHorns(arr) {
  arr.sort((a, b) => {
    // console.log(a.horns, b.horns);
    if (parseInt(a.horns) > parseInt(b.horns)) {
      return 1;
    }
    else if (parseInt(a.horns) < parseInt(b.horns)) {
      return -1;
    }
    else {return 0;}
  });
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
  $('main').html('');
   resetData();
   $.get(`../data/${dataFile}.json`, data => {
     data.forEach(obj => {
       new Horned(obj);
     });
   }).then(() => {sortByKey(objArray)}).then(renderImages);
 }

 function resetData() {
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

$('select').on('change', function(){
  let $select = $(this).val();
  $('section').hide();
  $(`section[data-keyword="${$select}"]`).show();
});

//button submit handler
  //delete all main content
  //re-render but sorted

$('button[value="page1"]').on('click', () => {
  readData('page-1');
});
$('button[value="page2"]').on('click', () => {
  readData('page-2');
});

$('button[value="sortHorn"]').on('click', () => {
  $('main').html('');
  sortByHorns(objArray);
  renderImages();
});

$('button[value="sortKeyword"]').on('click', () => {
  $('main').html('');
  sortByKey(objArray);
  renderImages();
});

