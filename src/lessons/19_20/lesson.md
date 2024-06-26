# Лекция про механизмы запросов и React Router Dom

## Механизмы для запросов

### XmlHttpRequets

`XMLHttpRequest` – это встроенный в браузер объект, который даёт возможность делать HTTP-запросы к серверу без перезагрузки страницы.

Несмотря на наличие слова «XML» в названии, XMLHttpRequest может работать с любыми данными, а не только с XML. Мы можем загружать/скачивать файлы, отслеживать прогресс и многое другое.

На сегодняшний день не обязательно использовать XMLHttpRequest, так как существует другой, более современный метод `fetch`.

В современной веб-разработке `XMLHttpRequest` используется по трём причинам:

1. По историческим причинам: существует много кода, использующего XMLHttpRequest, который нужно поддерживать.
2. Необходимость поддерживать старые браузеры и нежелание использовать полифилы (например, чтобы уменьшить количество кода).
3. Потребность в функциональности, которую fetch пока что не может предоставить, к примеру, отслеживание прогресса отправки на сервер.


















#### Чтобы сделать запрос, нам нужно выполнить три шага:
1. Создать XMLHttpRequest
```ts
let xhr = new XMLHttpRequest(); // у конструктора нет аргументов
```















2. Инициализировать его

`method` – HTTP-метод. Обычно это "GET" или "POST".
`URL` – URL, куда отправляется запрос: строка, может быть и объект URL.
`async` – если указать false, тогда запрос будет выполнен синхронно.
`user, password` – логин и пароль для базовой HTTP-авторизации (если требуется).
```ts
xhr.open(method, URL, [async, user, password])
```

Этот метод обычно вызывается сразу после new XMLHttpRequest. В него передаются основные параметры запроса:












3. Послать запрос.
```ts
xhr.send([body])
```
Этот метод устанавливает соединение и отсылает запрос к серверу. 

- Необязательный параметр body содержит тело запроса.
 - Некоторые типы запросов, такие как GET, не имеют тела. 
 - А некоторые, как, например, POST, используют body, чтобы отправлять данные на сервер.



















4. Слушать события на xhr, чтобы получить ответ.
Три наиболее используемых события:

- `load` – происходит, когда получен какой-либо ответ, включая ответы с HTTP-ошибкой, например 404.
- `error` – когда запрос не может быть выполнен, например, нет соединения или невалидный URL.
- `progress` – происходит периодически во время загрузки ответа, сообщает о прогрессе.


```ts
xhr.onload = function() {
  alert(`Загружено: ${xhr.status} ${xhr.response}`);
};

xhr.onerror = function() { // происходит, только когда запрос совсем не получилось выполнить
  alert(`Ошибка соединения`);
};

xhr.onprogress = function(event) { // запускается периодически
  // event.loaded - количество загруженных байт
  // event.lengthComputable = равно true, если сервер присылает заголовок Content-Length
  // event.total - количество байт всего (только если lengthComputable равно true)
  alert(`Загружено ${event.loaded} из ${event.total}`);
};
```


















Вот полный пример. Код ниже загружает /article/xmlhttprequest/example/load с сервера и сообщает о прогрессе:

```ts
// 1. Создаём новый XMLHttpRequest-объект
let xhr = new XMLHttpRequest();

// 2. Настраиваем его: GET-запрос по URL /article/.../load
xhr.open('GET', '/article/xmlhttprequest/example/load');

// 3. Отсылаем запрос
xhr.send();

// 4. Этот код сработает после того, как мы получим ответ сервера
xhr.onload = function() {
  if (xhr.status != 200) { // анализируем HTTP-статус ответа, если статус не 200, то произошла ошибка
    alert(`Ошибка ${xhr.status}: ${xhr.statusText}`); // Например, 404: Not Found
  } else { // если всё прошло гладко, выводим результат
    alert(`Готово, получили ${xhr.response.length} байт`); // response -- это ответ сервера
  }
};

xhr.onprogress = function(event) {
  if (event.lengthComputable) {
    alert(`Получено ${event.loaded} из ${event.total} байт`);
  } else {
    alert(`Получено ${event.loaded} байт`); // если в ответе нет заголовка Content-Length
  }

};

xhr.onerror = function() {
  alert("Запрос не удался");
};
```

















`После ответа сервера мы можем получить результат запроса в следующих свойствах xhr:`

- status
Код состояния HTTP (число): 200, 404, 403 и так далее, может быть 0 в случае, если ошибка не связана с HTTP.

- statusText
Сообщение о состоянии ответа HTTP (строка): обычно OK для 200, Not Found для 404, Forbidden для 403, и так далее.

- response (в старом коде может встречаться как responseText)
Тело ответа сервера.



















#### Мы можем также указать таймаут – промежуток времени, который мы готовы ждать ответ:
```ts
xhr.timeout = 10000; // таймаут указывается в миллисекундах, т.е. 10 секунд
```


















#### Чтобы добавить к URL параметры, вида `?name=value`, и корректно закодировать их, можно использовать объект URL:

```ts
let url = new URL('https://google.com/search');
url.searchParams.set('q', 'test me!');

// параметр 'q' закодирован
xhr.open('GET', url); // https://google.com/search?q=test+me%21
```











#### Тип ответа

Мы можем использовать свойство xhr.responseType, чтобы указать ожидаемый тип ответа:
- `""` (по умолчанию) – строка,
- `"text"` – строка,
- `"arraybuffer"` – ArrayBuffer (для бинарных данных, смотрите в ArrayBuffer, бинарные массивы),
- `"blob"` – Blob (для бинарных данных, смотрите в Blob),
- `"document"` – XML-документ (может использовать XPath и другие XML-методы),
- `"json"` – JSON (парсится автоматически).















К примеру, давайте получим ответ в формате JSON:
```ts
let xhr = new XMLHttpRequest();

xhr.open('GET', '/article/xmlhttprequest/example/json');

xhr.responseType = 'json';

xhr.send();

// тело ответа {"сообщение": "Привет, мир!"}
xhr.onload = function() {
  let responseObj = xhr.response;
  alert(responseObj.message); // Привет, мир!
};

```














#### У XMLHttpRequest есть состояния, которые меняются по мере выполнения запроса. 
Текущее состояние можно посмотреть в свойстве xhr.readyState.

Список всех состояний, указанных в спецификации:
```ts
UNSENT = 0; // исходное состояние
OPENED = 1; // вызван метод open
HEADERS_RECEIVED = 2; // получены заголовки ответа
LOADING = 3; // ответ в процессе передачи (данные частично получены)
DONE = 4; // запрос завершён
```















#### Состояния объекта XMLHttpRequest меняются в таком порядке: 
`0 → 1 → 2 → 3 → … → 3 → 4`. 
Состояние 3 повторяется каждый раз, когда получена часть данных.

Изменения в состоянии объекта запроса генерируют событие readystatechange:
```ts
xhr.onreadystatechange = function() {
  if (xhr.readyState == 3) {
    // загрузка
  }
  if (xhr.readyState == 4) {
    // запрос завершён
  }
};
```
















#### Отмена запроса

Если мы передумали делать запрос, можно отменить его вызовом xhr.abort():
```ts
xhr.abort(); // завершить запрос
```



















#### Синхронные запросы
Если в методе open третий параметр async установлен на false, запрос выполняется синхронно.

Другими словами, выполнение JavaScript останавливается на send() и возобновляется после получения ответа. Так ведут себя, например, функции alert или prompt.

Вот переписанный пример с параметром async, равным false:

```ts
let xhr = new XMLHttpRequest();

xhr.open('GET', '/article/xmlhttprequest/hello.txt', false);

try {
  xhr.send();
  if (xhr.status != 200) {
    alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
  } else {
    alert(xhr.response);
  }
} catch(err) { // для отлова ошибок используем конструкцию try...catch вместо onerror
  alert("Запрос не удался");
}
```


- Выглядит, может быть, и неплохо, но синхронные запросы используются редко, так как они блокируют выполнение JavaScript до тех пор, пока загрузка не завершена. 
- В некоторых браузерах нельзя прокручивать страницу, пока идёт синхронный запрос. 

- Ну а если же синхронный запрос по какой-то причине выполняется слишком долго, браузер предложит закрыть «зависшую» страницу.
- Многие продвинутые возможности XMLHttpRequest, такие как выполнение запроса на другой домен или установка таймаута, недоступны для синхронных запросов. 

- Также, как вы могли заметить, ни о какой индикации прогресса речь тут не идёт.
- Из-за всего этого синхронные запросы используют очень редко. Мы более не будем рассматривать их.
















#### HTTP-заголовки
XMLHttpRequest умеет как указывать свои заголовки в запросе, так и читать присланные в ответ.

Для работы с HTTP-заголовками есть 3 метода:

setRequestHeader(name, value)
Устанавливает заголовок запроса с именем name и значением value.

Например:
```ts
xhr.setRequestHeader('Content-Type', 'application/json');
```





##### Ещё одной особенностью XMLHttpRequest является то, что отменить setRequestHeader невозможно.

Если заголовок определён, то его нельзя снять. Повторные вызовы лишь добавляют информацию к заголовку, а не перезаписывают его.

Например:
```ts
xhr.setRequestHeader('X-Auth', '123');
xhr.setRequestHeader('X-Auth', '456');

// заголовок получится такой:
// X-Auth: 123, 456
```













```ts
getResponseHeader(name)
```

Возвращает значение заголовка ответа name (кроме Set-Cookie и Set-Cookie2).

Например:
```ts
xhr.getResponseHeader('Content-Type')
getAllResponseHeaders()
```

Возвращает все заголовки ответа, кроме `Set-Cookie` и `Set-Cookie2`.

Заголовки возвращаются в виде единой строки, например:

```ts
Cache-Control: max-age=31536000
Content-Length: 4260
Content-Type: image/png
Date: Sat, 08 Sep 2012 16:53:16 GMT
```












#### POST, FormData

Чтобы сделать `POST-запрос`, мы можем использовать встроенный объект `FormData`.

Синтаксис:

```ts
let formData = new FormData([form]); // создаём объект, по желанию берём данные формы <form>
formData.append(name, value); // добавляем поле


xhr.open('POST', ...) // создаём POST-запрос.
xhr.send(formData) // отсылаем форму серверу.
```




















#### Прогресс отправки

Событие `progress` срабатывает только на стадии загрузки ответа с сервера.

А именно: если мы отправляем что-то через POST-запрос, `XMLHttpRequest` сперва отправит наши данные (тело запроса) на сервер, 
а потом загрузит ответ сервера. И событие progress будет срабатывать только во время загрузки ответа.

Если мы отправляем что-то большое, то нас гораздо больше интересует прогресс отправки данных на сервер. Но xhr.onprogress тут не поможет.

Существует другой объект, без методов, только для отслеживания событий отправки: xhr.upload.

Он генерирует события, похожие на события xhr, но только во время отправки данных на сервер:

```ts
loadstart – начало загрузки данных.
progress – генерируется периодически во время отправки на сервер.
abort – загрузка прервана.
error – ошибка, не связанная с HTTP.
load – загрузка успешно завершена.
timeout – вышло время, отведённое на загрузку (при установленном свойстве timeout).
loadend – загрузка завершена, вне зависимости от того, как – успешно или нет.
```


Примеры обработчиков для этих событий:
```ts
xhr.upload.onprogress = function(event) {
  alert(`Отправлено ${event.loaded} из ${event.total} байт`);
};

xhr.upload.onload = function() {
  alert(`Данные успешно отправлены.`);
};

xhr.upload.onerror = function() {
  alert(`Произошла ошибка во время отправки: ${xhr.status}`);
};
```









### Fetch
JavaScript может отправлять сетевые запросы на сервер и подгружать новую информацию по мере необходимости.
Например, мы можем использовать сетевой запрос, чтобы:

- Отправить заказ,
- Загрузить информацию о пользователе,
- Запросить последние обновления с сервера,
- …и т.п.


`Для сетевых запросов из JavaScript есть широко известный термин «AJAX» (аббревиатура от Asynchronous JavaScript And XML).` 
`XML мы использовать не обязаны, просто термин старый, поэтому в нём есть это слово. Возможно, вы его уже где-то слышали.`


Метод `fetch()` — современный и очень мощный, он не поддерживается старыми, но поддерживается всеми современными браузерами.





















#### Базовый синтаксис:

```ts
let promise = fetch(url, [options])
```
`url` – URL для отправки запроса.
`options` – дополнительные параметры: метод, заголовки и так далее.




> (!) Без options это простой GET-запрос, скачивающий содержимое по адресу url.


Браузер сразу же начинает запрос и возвращает промис, который внешний код использует для получения результата.
Процесс получения ответа обычно происходит в два этапа:

















#### Во-первых, 
`promise` выполняется с объектом встроенного класса `Response` в качестве результата, как только сервер пришлёт заголовки ответа.

На этом этапе мы можем проверить статус HTTP-запроса и определить, выполнился ли он успешно, а также посмотреть заголовки, но пока без тела ответа.

Промис завершается с ошибкой, если fetch не смог выполнить HTTP-запрос, например при ошибке сети или если нет такого сайта. HTTP-статусы 404 и 500 не являются ошибкой.



















##### Мы можем увидеть HTTP-статус в свойствах ответа:
`status` – код статуса HTTP-запроса, например 200.
`ok` – логическое значение: будет true, если код HTTP-статуса в диапазоне 200-299.

Например:
```ts
let response = await fetch(url);

if (response.ok) { // если HTTP-статус в диапазоне 200-299
  // получаем тело ответа (см. про этот метод ниже)
  let json = await response.json();
} else {
  alert("Ошибка HTTP: " + response.status);
}
```















#### Во-вторых, 
для получения тела ответа нам нужно использовать дополнительный вызов метода.

Response предоставляет несколько методов, основанных на промисах, для доступа к телу ответа в различных форматах:

```ts
response.text() // читает ответ и возвращает как обычный текст,
response.json() // декодирует ответ в формате JSON,
response.formData() // возвращает ответ как объект FormData (разберём его в следующей главе),
response.blob() // возвращает объект как Blob (бинарные данные с типом),
response.arrayBuffer() // возвращает ответ как ArrayBuffer (низкоуровневое представление бинарных данных),
```

> помимо этого, `response.body` – это объект ReadableStream, с помощью которого можно считывать тело запроса по частям.















##### Например, получим JSON-объект с последними коммитами из репозитория на GitHub:

```ts
let url = 'https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits';
let response = await fetch(url);

let commits = await response.json(); // читаем ответ в формате JSON

alert(commits[0].author.login);
```













##### То же самое без await, с использованием промисов:
```ts
fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits')
  .then(response => response.json())
  .then(commits => alert(commits[0].author.login));
```


Для получения ответа в виде текста используем 
```ts
let response = await fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits');
let text = await response.text(); // прочитать тело ответа как текст
alert(text.slice(0, 80) + '...');
```


















#### Заголовки ответа
Заголовки ответа хранятся в похожем на Map объекте response.headers.

Это не совсем Map, но мы можем использовать такие же методы, как с Map, чтобы получить заголовок по его имени или перебрать заголовки в цикле:

```ts
let response = await fetch('https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits');

// получить один заголовок
alert(response.headers.get('Content-Type')); // application/json; charset=utf-8

// перебрать все заголовки
for (let [key, value] of response.headers) {
  alert(`${key} = ${value}`);
}
```














#### Заголовки запроса
Для установки заголовка запроса в fetch мы можем использовать опцию headers. Она содержит объект с исходящими заголовками, например:
```ts
let response = fetch(protectedUrl, {
  headers: {
    Authentication: 'secret'
  }
});
```
















##### Есть список запрещённых HTTP-заголовков, которые мы не можем установить:
- Accept-Charset, Accept-Encoding
- Access-Control-Request-Headers
- Access-Control-Request-Method
- Connection
- Content-Length
- Cookie, Cookie2
- Date
- DNT
- Expect
- Host
- Keep-Alive
- Origin
- Referer
- TE
- Trailer
- Transfer-Encoding
- Upgrade
- Via
- Proxy-*
- Sec-*

> Эти заголовки обеспечивают достоверность данных и корректную работу протокола HTTP, поэтому они контролируются исключительно браузером.




















#### POST-запросы
Для отправки POST-запроса или запроса с другим методом, нам необходимо использовать fetch параметры:

- method – HTTP метод, например POST,
- body – тело запроса, одно из списка:
 * строка (например, в формате JSON),
 * объект FormData для отправки данных как form/multipart,
 * Blob/BufferSource для отправки бинарных данных,
 * URLSearchParams для отправки данных в кодировке x-www-form-urlencoded, используется редко.


> Чаще всего используется JSON.













##### Например, этот код отправляет объект user как JSON:
```ts
let user = {
  name: 'John',
  surname: 'Smith'
};

let response = await fetch('/article/fetch/post/user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  body: JSON.stringify(user)
});

let result = await response.json();
alert(result.message);
```






















##### Заметим, 
что так как тело запроса `body` – строка, то заголовок `Content-Type` по умолчанию будет `text/plain;charset=UTF-8`.
Но, так как мы посылаем JSON, то используем параметр headers для отправки вместо этого application/json, правильный Content-Type для JSON.















#### Функция submit() может быть переписана без async/await, например, так:

```ts
function submit() {
  canvasElem.toBlob(function(blob) {
    fetch('/article/fetch/post/image', {
      method: 'POST',
      body: blob
    })
      .then(response => response.json())
      .then(result => alert(JSON.stringify(result, null, 2)))
  }, 'image/png');
}
```












#### Итого

##### ###Типичный запрос с помощью fetch состоит из двух операторов `await`:
```ts
let response = await fetch(url, options); // завершается с заголовками ответа
let result = await response.json(); // читать тело ответа в формате JSON
```


Или, без `await`:
```ts
fetch(url, options)
  .then(response => response.json())
  .then(result => /* обрабатываем результат */)
```












##### Параметры ответа:

- response.status – HTTP-код ответа,
- response.ok – true, если статус ответа в диапазоне 200-299.
- response.headers – похожий на Map объект с HTTP-заголовками.




##### Методы для получения тела ответа:
- response.text() – возвращает ответ как обычный текст,
- response.json() – декодирует ответ в формате JSON,
- response.formData() – возвращает ответ как объект FormData (кодировка form/multipart, см. следующую главу),
- response.blob() – возвращает объект как Blob (бинарные данные с типом),
- response.arrayBuffer() – возвращает ответ как ArrayBuffer (низкоуровневые бинарные данные),







### Axios
`https://habr.com/ru/companies/ruvds/articles/477286/`












## React Router Dom
рассмотрим на практике