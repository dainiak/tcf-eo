function getUniqueTags(objects) {
    const tagsSet = new Set();

    objects.forEach(obj => {
        if (obj.t && Array.isArray(obj.t)) {
            obj.t.forEach(tag => tagsSet.add(tag));
        }
    });

    return Array.from(tagsSet).sort();
}

function filterObjectsByTags(objects, tagsSubset) {
    return objects.filter(obj => {
        return tagsSubset.length === 0 || tagsSubset.every(tag => obj.t && obj.t.includes(tag));
    });
}

function displayQuestion(questionObject) {
    if(!questionObject) {
        return document.createTextNode('Aucune question ne correspond à vos critères.');
    }
    const div = document.createElement('div');
    div.className = 'card';

    const divBody = document.createElement('div');
    divBody.className = 'card-body';

    if(questionObject.ex){
        const ul = document.createElement('ul');
        ul.className = 'card-text';
        const topic = document.createElement('li');
        topic.innerHTML = '<b>Sujet du dialogue:</b> ' + questionObject.s + '. ';
        ul.appendChild(topic);
        const evaluator = document.createElement('li');
        evaluator.innerHTML = '<b>Rôle d’évaluateur:</b> ' + questionObject.ev + '. ';
        ul.appendChild(evaluator);
        const examinee = document.createElement('li');
        examinee.innerHTML = '<b>Votre rôle:</b> ' + questionObject.ex + '. ';
        ul.appendChild(examinee);
        const goal = document.createElement('li');
        goal.innerHTML = '<b>Votre objectif:</b> ' + questionObject.g + '. ';
        ul.appendChild(goal);
        const details = document.createElement('li');
        details.className = 'text-muted';
        details.innerHTML = '<b>Détails possibles à demander:</b> ' + questionObject.d.join(', ') + '. ';
        ul.appendChild(details);
        divBody.appendChild(ul);
    }
    else if(questionObject.t) {
        const p = document.createElement('p');
        p.className = 'card-text';
        p.textContent = questionObject.q;
        divBody.appendChild(p);
    }
    else {
        const p = document.createElement('p');
        p.className = 'card-text';
        p.textContent = 'Pr\u00e9sentez-vous bri\u00e8vement et d\u00e9crivez ' + questionObject;
        divBody.appendChild(p);
    }

    div.appendChild(divBody);
    return div;
}

function createCheckboxes(tags, prefix) {
    return tags.map((tag, index) => {
        const div = document.createElement('div');
        div.className = 'form-check form-check-inline';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = false;
        checkbox.className = 'form-check-input';
        checkbox.value = tag;
        checkbox.id = prefix + 'checkbox' + index;

        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.htmlFor = checkbox.id;
        label.textContent = tag;

        div.appendChild(checkbox);
        div.appendChild(label);

        return div;
    });
}

function gotoTranslation(e) {
    let t = e.target;
    while(t.tagName.toLowerCase() !== 'td') {
        t = t.parentElement;
    }

    let phrase = t.textContent.trim();
    window.open('https://translate.google.com/?sl=fr&tl=en&text=' + phrase + '&op=translate', '_blank');
}

for(let taskNumber of [1, 2, 3]) {
    const questions = window['part' + taskNumber + '_questions'];
    const tags = getUniqueTags(questions);
    const checkboxes = createCheckboxes(tags, 'task' + taskNumber + '_');
    const tagsContainer = document.getElementById('tags' + taskNumber);
    checkboxes.forEach(checkbox => {
        tagsContainer.appendChild(checkbox);
    });


    document.getElementById('random' + taskNumber).addEventListener('click', () => {
        const checkedTags = taskNumber > 1 && Array.from(tagsContainer.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
        const objects = taskNumber > 1 ? filterObjectsByTags(questions, checkedTags) : questions;
        const randomObject = objects[Math.floor(Math.random() * objects.length)];
        document.getElementById('content' + taskNumber).innerHTML = '';
        document.getElementById('content' + taskNumber).appendChild(displayQuestion(randomObject));
    });

    const contentContainer = document.getElementById('content' + taskNumber);
    contentContainer.innerHTML = '← Cliquez sur le bouton à gauche pour sélectionner une question aléatoire.';
    contentContainer.addEventListener('dblclick', gotoTranslation);
}
