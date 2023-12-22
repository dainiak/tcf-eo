function getUniqueTags(objects) {
    const tagsSet = new Set();
    objects.forEach(obj => obj.t && Array.isArray(obj.t) && obj.t.forEach(tag => tagsSet.add(tag)));
    return Array.from(tagsSet).sort();
}

function filterObjectsByTags(objects, tagsSubset) {
    return objects.filter(obj => tagsSubset.length === 0 || tagsSubset.every(tag => obj.t && obj.t.includes(tag)));
}

function createStopwatchButton(initialTime) {
    const stopwatchButton = document.createElement('button');
    stopwatchButton.classList.add('btn', 'btn-primary', 'm-1');
    stopwatchButton.innerHTML = '<i class="fas fa-stopwatch"></i><span></span>';
    const span = stopwatchButton.querySelector('span');
    let interval = null;
    let timeLeft = initialTime;
    let setText = () => {
        if (timeLeft < 20) {
            !span.classList.contains('blinking') && span.classList.add('blinking');
        } else {
            span.classList.contains('blinking') && span.classList.remove('blinking');
        }
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        span.innerHTML = `&nbsp;${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
    function startTimer() {
        interval && clearInterval(interval);
        interval = null;
        timeLeft = initialTime;
        setText();

        interval = setInterval(() => {
            if (--timeLeft < 0) {
                interval && clearInterval(interval);
                interval = null;
                timeLeft = 0;
                setText();
                return;
            }
            setText();
        }, 1000);
    }
    stopwatchButton.addEventListener('click', startTimer);
    return stopwatchButton;
}

function createToggles2(data) {
    const container = document.createElement('div');
    container.classList.add('container');
    let questionsDiv = null;

    if(data.q) {
        const questionsButton = document.createElement('button');
        questionsButton.classList.add('btn', 'btn-primary', 'm-1');
        questionsButton.setAttribute('data-bs-toggle', 'collapse');
        questionsButton.setAttribute('data-bs-target', '#questionsDiv');
        questionsButton.innerHTML = '<i class="fas fa-file-alt"></i>';
        container.appendChild(questionsButton);

        questionsDiv = document.createElement('div');
        questionsDiv.id = 'questionsDiv';
        questionsDiv.classList.add('collapse');
        const questionList = document.createElement('ul');
        data.q.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            questionList.appendChild(listItem);
        });
        questionsDiv.innerHTML = '<p><b>Voici quelques questions pour le dialogue :</b></p>';
        questionsDiv.appendChild(questionList);
    }

    container.appendChild(createStopwatchButton(330));
    questionsDiv && container.appendChild(questionsDiv);
    return container;
}

function createToggles3(data) {
    const container = document.createElement('div');
    container.classList.add('container');
    let ideasDiv = null;
    let essayDiv = null;

    if(data.i) {
        const ideasButton = document.createElement('button');
        ideasButton.classList.add('btn', 'btn-primary', 'm-1');
        ideasButton.setAttribute('data-bs-toggle', 'collapse');
        ideasButton.setAttribute('data-bs-target', '#ideasDiv');
        ideasButton.innerHTML = '<i class="fas fa-lightbulb"></i>';
        container.appendChild(ideasButton);

        ideasDiv = document.createElement('div');
        ideasDiv.id = 'ideasDiv';
        ideasDiv.classList.add('collapse');
        const ideaList = document.createElement('ul');
        data.i.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            ideaList.appendChild(listItem);
        });
        ideasDiv.innerHTML = '<p><b>Voici quelques idées pour votre monologue :</b></p>';
        ideasDiv.appendChild(ideaList);
    }

    if(data.e) {
        const essayButton = document.createElement('button');
        essayButton.classList.add('btn', 'btn-primary', 'm-1');
        essayButton.setAttribute('data-bs-toggle', 'collapse');
        essayButton.setAttribute('data-bs-target', '#essayDiv');
        essayButton.innerHTML = '<i class="fas fa-file-alt"></i>';
        container.appendChild(essayButton);
        essayDiv = document.createElement('div');
        essayDiv.id = 'essayDiv';
        essayDiv.classList.add('collapse');
        essayDiv.innerHTML = data.e;
    }

    container.appendChild(createStopwatchButton(270));
    ideasDiv && container.appendChild(ideasDiv);
    essayDiv && container.appendChild(essayDiv);
    return container;
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
        topic.innerHTML = `<b>Sujet du dialogue:</b> ${questionObject.s}. `;
        ul.appendChild(topic);
        const evaluator = document.createElement('li');
        evaluator.innerHTML = `<b>Rôle d’évaluateur:</b> ${questionObject.ev}. `;
        ul.appendChild(evaluator);
        const examinee = document.createElement('li');
        examinee.innerHTML = `<b>Votre rôle:</b> ${questionObject.ex}. `;
        ul.appendChild(examinee);
        const goal = document.createElement('li');
        goal.innerHTML = `<b>Votre objectif:</b> ${questionObject.g}. `;
        ul.appendChild(goal);
        const details = document.createElement('li');
        details.className = 'text-muted';
        details.innerHTML = `<b>Détails possibles à demander:</b> ${questionObject.d.join(', ')}. `;
        ul.appendChild(details);
        divBody.appendChild(ul);
        divBody.appendChild(createToggles2(questionObject));
    }
    else if(questionObject.t) {
        const p = document.createElement('p');
        p.className = 'card-text';
        p.textContent = questionObject.q;
        divBody.appendChild(p);
        divBody.appendChild(createToggles3(questionObject));
    }
    else {
        const p = document.createElement('p');
        p.className = 'card-text';
        p.textContent = `Présentez-vous brièvement et décrivez ${questionObject}`;
        divBody.appendChild(p);
        divBody.appendChild(createStopwatchButton(120));
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
        checkbox.id = `${prefix}checkbox${index}`;

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
    window.open(`https://translate.google.com/?sl=fr&tl=en&text=${phrase}&op=translate`, '_blank');
}

for(let taskNumber of [1, 2, 3]) {
    const questions = window[`part${taskNumber}_questions`];
    const tags = getUniqueTags(questions);
    const checkboxes = createCheckboxes(tags, `task${taskNumber}_`);
    const tagsContainer = document.getElementById(`tags${taskNumber}`);
    checkboxes.forEach(checkbox => tagsContainer.appendChild(checkbox));

    document.getElementById(`random${taskNumber}`).addEventListener('click', () => {
        const checkedTags = taskNumber > 1 && Array.from(tagsContainer.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
        const objects = taskNumber > 1 ? filterObjectsByTags(questions, checkedTags) : questions;
        const randomObject = objects[Math.floor(Math.random() * objects.length)];
        document.getElementById(`content${taskNumber}`).innerHTML = '';
        document.getElementById(`content${taskNumber}`).appendChild(displayQuestion(randomObject));
    });

    const contentContainer = document.getElementById(`content${taskNumber}`);
    contentContainer.innerHTML = '← Cliquez sur le bouton à gauche pour sélectionner une question aléatoire.';
    contentContainer.addEventListener('dblclick', gotoTranslation);
}
