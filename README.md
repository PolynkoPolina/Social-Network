<h1 align = "center">Social Network</h1>

<img src="static_for_readme/home_page.gif" alt="">
<hr>
<p>Основною метою проєкту є вдосконалення навичок програмування на фреймворці <strong>Django</strong> та розробити інтерактивну соціальну мережу з підтримкою миттєвого обміну даними, яка автоматизує взаємодію між користувачами без необхідності перезавантаження сторінок.. <b>Social Network</b> — соціальна мережа, яка орієнтується на спілкування між користувачами у режимі реального часу. В цьому проєкті реалізовані:</p>
<ul>
    <li>Реалізовано архітектуру бази даних, систему автентифікації користувачів, обробку форм</li>
    <li>Авторизація, реєстрація та зміна паролю користувача</li>
    <li>Налаштовано двосторонній зв'язок у реальному часі для миттєвого обміну повідомленнями в чатах</li>
    <li>Реалізовано асинхронні HTTP-запити до бекенду для динамічного оновлення контенту</li>
</ul>
<hr>

<h2>Зміст:</h2>
<ul>
    <li><a href="#team">Команда</a></li>
    <li><a href="#structure">Структура:</a></li>
    <li><a href="#modules">Модулі</a></li>
    <li><a href="#start-project">Запуск</a></li>
    <li><a href="#conclusions">Висновки</a></li>
</ul>

<hr>

<h2 id="#structure">Структура</h2>
<p>Проєкт складається з таких основних папок:</p>
    <ul>
        <li><b>social_network</b>— основна папка проєкту</li>
        <li><b>chat</b> — застосунок чату</li>
        <li><b>user</b> — застосунок користувача/ки</li>
        <li><b>post</b> — застосунок постів</li>
        <li><b>home</b> — застосунок головної, інформаційної сторінки</li>
    </ul>
<img src="static_for_readme/project_structure.png" alt="">
<p><a href="https://www.figma.com/board/5qO94NLfsrvKq1uQuvLKck/Untitled?node-id=0-1&t=6CmNQ7EBv147dVIS-1">Посилання на структуру проєкту</a></p>




<hr>

<h2>Команда:</h2>
<ul>
    <li><a href="https://github.com/PolynkoPolina">Полинько Поліна</a> — тімлідер, головна розробниця</li>
    <li><a href="https://github.com/GeorgeGrod">Георгій Гродський</a> — розробник</li>
    <li><a href="https://github.com/OlehNedilko">Олег Неділько</a> — розробник</li>
</ul>

<hr>

<h2 id="modules">Модулі проєкту</h2>
<ul>
    <li><a href="https://pypi.org/project/Django/">Django</a> — основний фреймворк</li>
    <li><a href="https://pypi.org/project/daphne/">Daphne</a> — він приймає мережеві запити та передає їх у python</li>
    <li><a href="https://pypi.org/project/pillow/">Pillow</a> — дозволяє завантажувати, змінювати розміри, обрізати картинки, накладати фільтри чи конвертувати формати</li>
    <li><a href="https://pypi.org/project/tzdata/">Tzdata</a> — пакет, що містить базу даних часових поясів</li>
    <li><a href="https://pypi.org/project/channels/">Channels</a> — додає підтримку асинхронних протоколів</li>
</ul>