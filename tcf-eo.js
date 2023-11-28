let task0 = "Pr\u00e9sentez-vous bri\u00e8vement.";
let task1 = window.part1_questions;
let task2 = window.part2_questions;
let task3 = window.part3_questions;

function getUniqueTags(objects) {
    const tagsSet = new Set();

    objects.forEach(obj => {
        if (obj.t && Array.isArray(obj.t)) {
            obj.t.forEach(tag => tagsSet.add(tag));
        }
    });

    return Array.from(tagsSet);
}

console.log(getUniqueTags(task2));
console.log(getUniqueTags(task3));
/*
let task2_tags = [];
for(let task of task2) {
    for(let tag of task["tags"]) {
        if(!task2_tags.includes(tag)) {
            task2_tags.push(tag);
        }
    }
}


function gotoTranslation(e) {
    let t = e.target;
    while(t.tagName.toLowerCase() !== 'tr' && t.id !== 'results-table') {
        t = t.parentElement;
    }
    if(t.id === 'results-table')
        return;

    let phrase = t.querySelector('td:nth-of-type(2)').textContent.trim();
    window.open('https://translate.google.com/?sl=fr&tl=en&text=' + phrase + '&op=translate', '_blank');
}

document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const searchInput = document.getElementById('search-input');
    let part = searchInput.value;
    part = part.trim().replace(/ /gu, '');
    searchInput.value = part;

    let types = (
        (document.getElementById('adjectives').checked ? 'A' : '')
        + (document.getElementById('nouns').checked ? 'N' : '')
        + (document.getElementById('verbs').checked ? 'V' : '')
        + (document.getElementById('adverbs').checked ? 'W' : '')
    );
    const results = find(part, types);
    const tableBody = document.getElementById('table-body');

    for(let row of tableBody.querySelectorAll('tr')) {
        row.tooltip && row.tooltip.dispose();
    }
    tableBody.innerHTML = "";

    let pattern = part.replace(/ /gu, '');
    if(pattern.startsWith('*')) {
        pattern = pattern.substring(1);
    }
    else if(!pattern.startsWith('^')){
        pattern = '^' + pattern;
    }
    if(pattern.endsWith('*') && !pattern.endsWith('.*')){
        pattern = pattern.substring(0, pattern.length - 1);
    }
    else if (!pattern.endsWith('$')){
        pattern = pattern + '$';
    }

    currentPattern = new RegExp(pattern, 'igu');

    results.forEach(triple => {
        const [word, stem, type] = triple.split(' ');
        if (document.getElementById('primaryForm').checked && word !== stem){
            return;
        }
        const row = document.createElement('tr');
        const cellWord = document.createElement('td');
        cellWord.innerHTML = highlightPart(word);
        const cellStem = document.createElement('td');
        cellStem.innerHTML = highlightPart(stem);
        const cellType = document.createElement('td');
        cellType.innerHTML = getType(type);
        row.appendChild(cellWord);
        row.appendChild(cellStem);
        row.appendChild(cellType);
        row.dataset.bsToggle = 'tooltip';
        row.dataset.bsPlacement = 'bottom';
        row.dataset.bsTitle = 'Double-click row to translate with Google Translate';
        tableBody.appendChild(row);
        row.tooltip = new bootstrap.Tooltip(row);
    });

    if(results.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="3" style="text-align: center"><strong>(No results)</strong></td>';
        tableBody.appendChild(row);
    }

    tableBody.addEventListener('dblclick', gotoTranslation);
});

*/


document.addEventListener('DOMContentLoaded', function() {
    let btn = document.getElementById('scrollToTop');

    window.addEventListener('scroll', () => {
        btn.style.display = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ? 'block' : 'none';
    });

    btn.addEventListener('click', () => document.body.scrollTop = document.documentElement.scrollTop = 0);
});

