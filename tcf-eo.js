function gotoTranslation(e) {
    let t = e.target;
    while(t.tagName.toLowerCase() !== 'tr' && t.id !== 'results-table') {
        t = t.parentElement;
    }
    if(t.id === 'results-table')
        return;

    let word = t.querySelector('td:nth-of-type(2)').textContent.trim();
    window.open('https://translate.google.com/?sl=fr&tl=en&text=' + word + '&op=translate', '_blank');
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

document.addEventListener('DOMContentLoaded', function() {
    let query= window.location.href.match(/q=[^&]*/);
    query = query ? decodeURI(query[0].substring(2)) : '';
    let partsOfSpeech = window.location.href.match(/ps=[^&]*/);
    partsOfSpeech = partsOfSpeech ? partsOfSpeech[0].substring(3) : 'AVNW';
    let searchType = window.location.href.match(/st=[^&]*/);
    searchType = searchType ? searchType[0].substring(3) : 'exact';
    let regexp = window.location.href.match(/re=[^&]*/);
    regexp = regexp ? regexp[0].substring(3) : '0';
    let primaryForm = window.location.href.match(/pf=[^&]*/);
    primaryForm = primaryForm ? primaryForm[0].substring(3) : '0';

    document.getElementById('search-input').value = query;
    document.getElementById('adjectives').checked = partsOfSpeech.indexOf('A') > -1;
    document.getElementById('nouns').checked = partsOfSpeech.indexOf('N') > -1;
    document.getElementById('verbs').checked = partsOfSpeech.indexOf('V') > -1;
    document.getElementById('adverbs').checked = partsOfSpeech.indexOf('W') > -1;
    document.getElementById(searchType).checked = true;
    document.getElementById('regexp').checked = regexp === '1';
    document.getElementById('primaryForm').checked = primaryForm === '1';
    document.getElementById('search-form').dispatchEvent(new Event('submit'));


    let btn = document.getElementById('scrollToTop');

    window.addEventListener('scroll', () => {
        btn.style.display = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ? 'block' : 'none';
    });

    btn.addEventListener('click', () => document.body.scrollTop = document.documentElement.scrollTop = 0);
});

