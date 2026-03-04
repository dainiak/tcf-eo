(() => {
    document.body.setAttribute(
        'data-bs-theme',
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    );

    const getUniqueTags = (objects) => {
        const tagsSet = new Set();
        objects.forEach((obj) => obj.t && Array.isArray(obj.t) && obj.t.forEach((tag) => tagsSet.add(tag)));
        return Array.from(tagsSet).sort();
    };

    const filterObjectsByTags = (objects, tagsSubset) =>
        objects.filter((obj) => tagsSubset.length === 0 || tagsSubset.every((tag) => obj.t?.includes(tag)));

    const createStopwatchButton = (initialTime) => {
        const stopwatchButton = document.createElement('button');
        stopwatchButton.classList.add('btn', 'btn-primary', 'm-1');
        stopwatchButton.innerHTML = '<i class="fas fa-stopwatch"></i><span></span>';
        const span = stopwatchButton.querySelector('span');
        let interval = null;
        let timeLeft = initialTime;
        const setText = () => {
            span.classList.toggle('blinking', timeLeft < 20);
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            span.innerHTML = `&nbsp;${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        };

        const startTimer = () => {
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
        };

        stopwatchButton.addEventListener('click', startTimer);
        return stopwatchButton;
    };

    const createList = (items) => {
        const ul = document.createElement('ul');
        items.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
        return ul;
    };

    const createCollapsibleSection = (id, icon, contentElement) => {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary', 'm-1');
        button.setAttribute('data-bs-toggle', 'collapse');
        button.setAttribute('data-bs-target', `#${id}`);
        button.innerHTML = `<i class="fas fa-${icon}"></i>`;

        const div = document.createElement('div');
        div.id = id;
        div.classList.add('collapse');
        div.appendChild(contentElement);

        return { button, div };
    };

    const createToggles = (data, sections, stopwatchTime) => {
        const container = document.createElement('div');
        container.classList.add('container');
        const collapsibles = [];

        for (const { field, id, icon, heading } of sections) {
            if (!data[field]) continue;
            const content = document.createElement('div');
            if (heading) {
                content.innerHTML = `<p><b>${heading}</b></p>`;
                content.appendChild(createList(data[field]));
            } else {
                content.innerHTML = data[field];
            }
            collapsibles.push(createCollapsibleSection(id, icon, content));
        }

        collapsibles.forEach(({ button }) => container.appendChild(button));
        container.appendChild(createStopwatchButton(stopwatchTime));
        collapsibles.forEach(({ div }) => container.appendChild(div));
        return container;
    };

    const displayQuestion = (questionObject) => {
        if (!questionObject) {
            return document.createTextNode('Aucune question ne correspond à vos critères.');
        }
        const div = document.createElement('div');
        div.className = 'card';

        const divBody = document.createElement('div');
        divBody.className = 'card-body';

        if (questionObject.ex) {
            const ul = document.createElement('ul');
            ul.className = 'card-text';
            const topic = document.createElement('li');
            topic.innerHTML = `<b>Sujet du dialogue&nbsp;:</b> ${questionObject.s}. `;
            ul.appendChild(topic);
            const evaluator = document.createElement('li');
            evaluator.innerHTML = `<b>Rôle d’évaluateur&nbsp;:</b> ${questionObject.ev}. `;
            ul.appendChild(evaluator);
            const examinee = document.createElement('li');
            examinee.innerHTML = `<b>Votre rôle&nbsp;:</b> ${questionObject.ex}. `;
            ul.appendChild(examinee);
            const goal = document.createElement('li');
            goal.innerHTML = `<b>Votre objectif&nbsp;:</b> ${questionObject.g}. `;
            ul.appendChild(goal);
            const details = document.createElement('li');
            details.className = 'text-muted';
            details.innerHTML = `<b>Détails possibles à demander&nbsp;:</b> ${questionObject.d.join(', ')}. `;
            ul.appendChild(details);
            divBody.appendChild(ul);
            divBody.appendChild(
                createToggles(
                    questionObject,
                    [
                        {
                            field: 'q',
                            id: 'questionsDiv',
                            icon: 'file-alt',
                            heading: 'Voici quelques questions pour le dialogue :',
                        },
                    ],
                    330,
                ),
            );
        } else if (questionObject.t) {
            const p = document.createElement('p');
            p.className = 'card-text';
            p.textContent = questionObject.q;
            divBody.appendChild(p);
            divBody.appendChild(
                createToggles(
                    questionObject,
                    [
                        {
                            field: 'i',
                            id: 'ideasDiv',
                            icon: 'lightbulb',
                            heading: 'Voici quelques idées pour votre monologue :',
                        },
                        { field: 'e', id: 'essayDiv', icon: 'file-alt' },
                    ],
                    270,
                ),
            );
        } else {
            const p = document.createElement('p');
            p.className = 'card-text';
            p.textContent = `Présentez-vous brièvement et décrivez ${questionObject}`;
            divBody.appendChild(p);
            divBody.appendChild(createStopwatchButton(120));
        }

        div.appendChild(divBody);
        return div;
    };

    const createCheckboxes = (tags, prefix) =>
        tags.map((tag, index) => {
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

    const gotoTranslation = (e) => {
        const td = e.target.closest('td');
        if (!td) return;
        const phrase = td.textContent.trim();
        window.open(`https://translate.google.com/?sl=fr&tl=en&text=${phrase}&op=translate`, '_blank');
    };

    for (const taskNumber of [1, 2, 3]) {
        const questions = window[`part${taskNumber}_questions`];
        const tags = getUniqueTags(questions);
        const checkboxes = createCheckboxes(tags, `task${taskNumber}_`);
        const tagsContainer = document.getElementById(`tags${taskNumber}`);
        const contentContainer = document.getElementById(`content${taskNumber}`);
        checkboxes.forEach((checkbox) => checkbox instanceof Node && tagsContainer.appendChild(checkbox));

        document.getElementById(`random${taskNumber}`).addEventListener('click', () => {
            const checkedTags =
                taskNumber > 1 &&
                Array.from(tagsContainer.querySelectorAll('input[type="checkbox"]:checked')).map(
                    (checkbox) => checkbox.value,
                );
            const objects = taskNumber > 1 ? filterObjectsByTags(questions, checkedTags) : questions;
            const randomObject = objects[Math.floor(Math.random() * objects.length)];
            contentContainer.innerHTML = '';
            contentContainer.appendChild(displayQuestion(randomObject));
        });

        contentContainer.innerHTML = '← Cliquez sur le bouton à gauche pour sélectionner une question aléatoire.';
        contentContainer.addEventListener('dblclick', gotoTranslation);
    }

    const scrollToTopButton = document.getElementById('scrollToTop');
    window.addEventListener('scroll', () => {
        scrollToTopButton.style.display = window.scrollY > 200 ? 'block' : 'none';
    });
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();
